import pytest
from io import StringIO
from unittest.mock import patch
from django.core.management import call_command

@pytest.mark.django_db
class TestUpdateCommand:

    @patch('data_management.management.commands.update.load_db_from_latest_archive')
    @patch('builtins.input', return_value='yes')
    def test_update_archive_yes(self, mock_input, mock_load_db):
        """
        Test that the --archive flag calls load_db_from_latest_archive when the user confirms.
        """
        out = StringIO()
        call_command('update', '--archive', stdout=out)
        
        mock_load_db.assert_called_once()
        assert 'Starting database load from archive...' in out.getvalue()

    @patch('data_management.management.commands.update.load_db_from_latest_archive')
    @patch('builtins.input', return_value='no')
    def test_update_archive_no(self, mock_input, mock_load_db):
        """
        Test that the --archive flag does not call load_db_from_latest_archive when the user cancels.
        """
        out = StringIO()
        call_command('update', '--archive', stdout=out)
        
        mock_load_db.assert_not_called()
        assert 'Database load cancelled.' in out.getvalue()

    def test_no_flags(self):
        """Test that the command shows a warning if no flags are provided."""
        out = StringIO()
        call_command('update', stdout=out)
        assert 'No update flag specified' in out.getvalue()

