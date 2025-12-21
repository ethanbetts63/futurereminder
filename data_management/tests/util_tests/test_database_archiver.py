import pytest
import subprocess
from unittest.mock import patch, MagicMock, call, ANY
from io import StringIO
import os
from data_management.utils.archive_db.database_archiver import DatabaseArchiver

class MockModel:
    def __init__(self, app_label, model_name):
        self._meta = MagicMock()
        self.app_label = app_label
        self.model_name = model_name
        self._meta.app_label = app_label
        self._meta.model_name = model_name

@pytest.fixture
def mock_command():
    """Fixture to create a mock management command with stdout and stderr."""
    command = MagicMock()
    command.stdout = StringIO()
    command.stderr = StringIO()
    command.style = MagicMock()
    command.style.SUCCESS = lambda x: x
    command.style.ERROR = lambda x: x
    return command

@patch('data_management.utils.archive_db.database_archiver.os.path.exists', return_value=True)
@patch('data_management.utils.archive_db.database_archiver.os.makedirs')
class TestDatabaseArchiver:

    @patch('data_management.utils.archive_db.database_archiver.ModelLister')
    @patch('data_management.utils.archive_db.database_archiver.subprocess.run')
    def test_archive_success(self, mock_subprocess_run, mock_model_lister, mock_makedirs, mock_path_exists, mock_command, tmp_path):
        """Test the successful archiving of models."""
        mock_model1 = MockModel('app1', 'Model1')
        mock_model2 = MockModel('app2', 'Model2')
        mock_model_lister.return_value.get_all_models.return_value = [mock_model1, mock_model2]
        
        archiver = DatabaseArchiver(command=mock_command)
        archiver.archive_dir = str(tmp_path)
        
        archiver.archive()
        
        assert mock_model_lister.return_value.get_all_models.called
        
        python_executable = os.path.abspath(os.path.join('venv', 'Scripts', 'python.exe'))
        
        expected_calls = [
            call([python_executable, 'manage.py', 'dumpdata', 'app1.Model1', '--output', str(tmp_path / 'app1.Model1.json'), '--indent', '2'], check=True, capture_output=True, text=True, env=ANY, encoding='utf-8', errors='replace'),
            call([python_executable, 'manage.py', 'dumpdata', 'app2.Model2', '--output', str(tmp_path / 'app2.Model2.json'), '--indent', '2'], check=True, capture_output=True, text=True, env=ANY, encoding='utf-8', errors='replace')
        ]
        mock_subprocess_run.assert_has_calls(expected_calls, any_order=True)
        
        stdout = mock_command.stdout.getvalue()
        assert "Archiving app1.Model1" in stdout
        assert "Archiving app2.Model2" in stdout
        assert "Database archive complete" in stdout

    @patch('data_management.utils.archive_db.database_archiver.ModelLister')
    @patch('data_management.utils.archive_db.database_archiver.subprocess.run')
    def test_archive_failure(self, mock_subprocess_run, mock_model_lister, mock_makedirs, mock_path_exists, mock_command, tmp_path):
        """Test the handling of a failed dumpdata command."""
        mock_model = MockModel('app1', 'Model1')
        mock_model_lister.return_value.get_all_models.return_value = [mock_model]
        
        mock_subprocess_run.side_effect = subprocess.CalledProcessError(1, 'cmd', stderr='An error occurred')
        
        archiver = DatabaseArchiver(command=mock_command)
        archiver.archive_dir = str(tmp_path)
        
        archiver.archive()
        
        stderr = mock_command.stderr.getvalue()
        assert "Failed to archive app1.Model1" in stderr
        assert "An error occurred" in stderr

    @patch('data_management.utils.archive_db.database_archiver.ModelLister')
    def test_no_models_found(self, mock_model_lister, mock_makedirs, mock_path_exists, mock_command):
        """Test the case where no models are found to archive."""
        mock_model_lister.return_value.get_all_models.return_value = []
        
        archiver = DatabaseArchiver(command=mock_command)
        
        with patch('sys.stdout', new_callable=StringIO) as captured_stdout:
            archiver.archive()
            assert "No models found to archive" in captured_stdout.getvalue()
