import pytest
import os
import subprocess
from unittest.mock import patch, MagicMock, call, ANY
from io import StringIO
from data_management.utils.archive_db.load_db_from_archive import load_db_from_latest_archive

@pytest.fixture
def mock_command():
    """Fixture to create a mock management command with stdout and stderr."""
    command = MagicMock()
    command.stdout = StringIO()
    command.stderr = StringIO()
    command.style = MagicMock()
    command.style.SUCCESS = lambda x: x
    command.style.ERROR = lambda x: x
    command.style.WARNING = lambda x: x
    return command

@patch('data_management.utils.archive_db.load_db_from_archive.os.path.exists')
@patch('data_management.utils.archive_db.load_db_from_archive.os.listdir')
@patch('data_management.utils.archive_db.load_db_from_archive.os.path.isdir', return_value=True)
class TestLoadDbFromArchive:

    @patch('data_management.utils.archive_db.load_db_from_archive.subprocess.run')
    def test_load_success(self, mock_subprocess_run, mock_isdir, mock_listdir, mock_exists, mock_command):
        """Test the successful loading of data from an archive."""
        mock_exists.return_value = True
        mock_listdir.return_value = ['2025-12-20_12-00-00', '2025-12-21_12-00-00']
        
        load_db_from_latest_archive(command=mock_command)
        
        base_archive_dir = os.path.join('data_management', 'data', 'archive', 'db_backups')
        latest_archive_dir = os.path.join(base_archive_dir, '2025-12-21_12-00-00')
        
        python_executable = ANY
        
        expected_calls = [
            call([python_executable, 'manage.py', 'flush', '--no-input'], check=True, capture_output=True, text=True, env=ANY, encoding='utf-8', errors='replace'),
            call([python_executable, 'manage.py', 'loaddata', os.path.join(latest_archive_dir, 'payments.tier.json')], check=True, capture_output=True, text=True, env=ANY, encoding='utf-8', errors='replace'),
            call([python_executable, 'manage.py', 'loaddata', os.path.join(latest_archive_dir, 'payments.price.json')], check=True, capture_output=True, text=True, env=ANY, encoding='utf-8', errors='replace'),
            # ... and so on for all files in load_order
        ]
        
        # Check that flush was called
        mock_subprocess_run.assert_any_call([python_executable, 'manage.py', 'flush', '--no-input'], check=True, capture_output=True, text=True, env=ANY, encoding='utf-8', errors='replace')
        
        # Check that loaddata was called for each file
        assert mock_subprocess_run.call_count == 10 # 1 flush + 9 loaddata
        
        stdout = mock_command.stdout.getvalue()
        assert f"Loading data from latest archive: {latest_archive_dir}" in stdout
        assert "Flushing database..." in stdout
        assert "Loading payments.tier.json" in stdout
        assert "Data loading from archive complete" in stdout

    def test_archive_dir_not_found(self, mock_isdir, mock_listdir, mock_exists, mock_command):
        """Test the case where the base archive directory does not exist."""
        mock_exists.return_value = False
        
        load_db_from_latest_archive(command=mock_command)
        
        stderr = mock_command.stderr.getvalue()
        assert "Archive directory not found" in stderr

    def test_no_archive_subdirs_found(self, mock_isdir, mock_listdir, mock_exists, mock_command):
        """Test the case where there are no archive subdirectories."""
        mock_exists.return_value = True
        mock_listdir.return_value = [] # No subdirectories
        
        load_db_from_latest_archive(command=mock_command)
        
        stderr = mock_command.stderr.getvalue()
        assert "No archive directories found" in stderr

    @patch('data_management.utils.archive_db.load_db_from_archive.subprocess.run')
    def test_flush_failure(self, mock_subprocess_run, mock_isdir, mock_listdir, mock_exists, mock_command):
        """Test the case where the flush command fails."""
        mock_exists.return_value = True
        mock_listdir.return_value = ['2025-12-21_12-00-00']
        mock_subprocess_run.side_effect = subprocess.CalledProcessError(1, 'cmd', stderr='Flush failed')
        
        load_db_from_latest_archive(command=mock_command)
        
        stderr = mock_command.stderr.getvalue()
        assert "Failed to flush database" in stderr
        assert "Flush failed" in stderr
        
    @patch('data_management.utils.archive_db.load_db_from_archive.subprocess.run')
    def test_loaddata_failure(self, mock_subprocess_run, mock_isdir, mock_listdir, mock_exists, mock_command):
        """Test the case where a loaddata command fails."""
        mock_exists.return_value = True
        mock_listdir.return_value = ['2025-12-21_12-00-00']
        
        # Make flush succeed but loaddata fail
        mock_subprocess_run.side_effect = [
            MagicMock(), # Success for flush
            subprocess.CalledProcessError(1, 'cmd', stderr='Load failed')
        ]
        
        load_db_from_latest_archive(command=mock_command)
        
        stderr = mock_command.stderr.getvalue()
        assert "Failed to load payments.tier.json" in stderr
        assert "Load failed" in stderr
        assert "Aborting data load" in stderr
