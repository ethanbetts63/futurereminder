import pytest
from io import StringIO
from django.core.management import call_command
from PIL import Image
import os

@pytest.mark.django_db
class TestResizeImagesCommand:

    def test_resize_image_success(self, tmp_path):
        """
        Test that the command successfully resizes an image and creates webp versions.
        """
        # 1. Create a dummy image
        image_path = tmp_path / "test_image.png"
        dummy_image = Image.new('RGB', (2000, 1000), color = 'red')
        dummy_image.save(image_path)
        
        # 2. Call the command
        out = StringIO()
        call_command('resize_images', str(image_path), stdout=out)
        
        # 3. Assert that the resized images are created
        expected_widths = [320, 640, 768, 1024, 1280]
        for width in expected_widths:
            resized_path = tmp_path / f"test_image-{width}w.webp"
            assert os.path.exists(resized_path)
            
            # 4. Assert that the resized images have the correct dimensions
            with Image.open(resized_path) as img:
                assert img.width == width
                # Check that aspect ratio is maintained (2:1)
                assert img.height == int(width * 0.5)

        assert f"Successfully created {tmp_path / 'test_image-320w.webp'}" in out.getvalue()

    def test_image_not_found(self):
        """
        Test that the command handles the case where the image does not exist.
        """
        out = StringIO()
        call_command('resize_images', 'non_existent_image.png', stdout=out)
        assert "Image not found at: non_existent_image.png" in out.getvalue()

    def test_invalid_image_file(self, tmp_path):
        """
        Test that the command handles a file that is not a valid image.
        """
        # Create a non-image file
        file_path = tmp_path / "not_an_image.txt"
        with open(file_path, "w") as f:
            f.write("this is not an image")
            
        out = StringIO()
        call_command('resize_images', str(file_path), stdout=out)
        assert "An error occurred" in out.getvalue()