# # import segno
#
# # def generate_qr_with_svg_overlay(text, overlay_svg_path, output_svg_path):
# #     """
# #     Generate a QR code with an SVG overlay on top.
# #     Args:
# #         text (str): The text or data for the QR code.
# #         overlay_svg_path (str): Path to the SVG file to overlay.
# #         output_svg_path (str): Path to save the resulting SVG.
# #     """
# #     # Generate the QR code as SVG
# #     qr = segno.make(text)
# #     qr_svg_path = "temp_qr.svg"
# #     qr.save(qr_svg_path, scale=10)  # Save as an SVG with a larger scale
#
# #     # Load the QR code SVG and clean it
# #     with open(qr_svg_path, 'r') as qr_file:
# #         qr_svg_content = qr_file.read().strip()
# #         # Remove XML declaration if present
# #         if qr_svg_content.startswith('<?xml'):
# #             qr_svg_content = qr_svg_content.split('?>', 1)[1].strip()
#
# #     # Load the overlay SVG and clean it
# #     with open(overlay_svg_path, 'r') as overlay_file:
# #         overlay_content = overlay_file.read().strip()
# #         # Remove XML declaration if present
# #         if overlay_content.startswith('<?xml'):
# #             overlay_content = overlay_content.split('?>', 1)[1].strip()
#
# #     # Combine the SVGs
# #     svg_template = f"""<?xml version="1.0" encoding="UTF-8"?>
# #     <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
# #     <!-- Add a rounded border -->
# #         <rect x="1.5" y="1.5" width="330" height="400" rx="30" ry="30" fill="none" stroke="black" stroke-width="6"/>
# #         <!-- QR Code -->
# #                 <g transform="translate(0, 8)">  <!-- Adjust positioning and scale -->
# #             {qr_svg_content}
# #         </g>
#
# #         <!-- Overlay positioned at the center -->
# #         <g transform="translate(65, 310) scale(0.8)">  <!-- Adjust positioning and scale -->
# #             {overlay_content}
# #         </g>
# #     </svg>
# #     """
#
# #     # Save the final SVG
# #     with open(output_svg_path, 'w') as output_file:
# #         output_file.write(svg_template.strip())
#
# #     print(f"QR code with overlay saved to {output_svg_path}")
#
# # # Usage
# # generate_qr_with_svg_overlay(
# #     text="https://example.com",
# #     overlay_svg_path="uGem.svg",  # Path to your SVG logo
# #     output_svg_path="qr_with_logo.svg"  # Path for the final SVG
# # )
#
# import segno
# import cairosvg
# import os
#
#
# def generate_qr_with_svg_overlay(text, overlay_svg_path, output_svg_path, output_png_path):
#     """
#     Generate a QR code with an SVG overlay on top and convert it to PNG.
#
#     Args:
#         text (str): The text or data for the QR code.
#         overlay_svg_path (str): Path to the SVG file to overlay.
#         output_svg_path (str): Path to save the resulting SVG.
#         output_png_path (str): Path to save the resulting PNG.
#     """
#     # Generate the QR code as SVG
#     qr = segno.make(text)
#     qr_svg_path = "temp_qr.svg"
#     qr.save(qr_svg_path, scale=20)  # Save as an SVG with a larger scale
#
#     # Load the QR code SVG and clean it
#     with open(qr_svg_path, 'r') as qr_file:
#         qr_svg_content = qr_file.read().strip()
#         # Remove XML declaration if present
#         if qr_svg_content.startswith('<?xml'):
#             qr_svg_content = qr_svg_content.split('?>', 1)[1].strip()
#
#     # Load the overlay SVG and clean it
#     with open(overlay_svg_path, 'r') as overlay_file:
#         overlay_content = overlay_file.read().strip()
#         # Remove XML declaration if present
#         if overlay_content.startswith('<?xml'):
#             overlay_content = overlay_content.split('?>', 1)[1].strip()
#
#     # Combine the SVGs
#     svg_template = f"""<?xml version="1.0" encoding="UTF-8"?>
#     <svg xmlns="http://www.w3.org/2000/svg" width="680" height="820" viewBox="0 0 680 820">
#         <!-- Add a rounded border -->
#         <g transform="translate(8, 8)">  <!-- Adjust positioning and scale -->
#         <rect x="1.5" y="1.5" width="660" height="800" rx="30" ry="30" fill="none" stroke="black" stroke-width="20"/>
#         </g>
#
#         <!-- QR Code -->
#         <g transform="translate(10, 8)">  <!-- Adjust positioning and scale -->
#             {qr_svg_content}
#         </g>
#
#         <!-- Overlay positioned at the center -->
#         <g transform="translate(150, 620) scale(1.6)">  <!-- Adjust positioning and scale -->
#             {overlay_content}
#         </g>
#     </svg>
#     """
#
#     # Save the final SVG
#     with open(output_svg_path, 'w') as output_file:
#         output_file.write(svg_template.strip())
#
#     print(f"QR code with overlay saved to {output_svg_path}")
#
#     # Convert SVG to PNG using CairoSVG
#     try:
#         cairosvg.svg2png(url=output_svg_path, write_to=output_png_path)
#         print(f"PNG version saved to {output_png_path}")
#     except Exception as e:
#         print(f"Error converting SVG to PNG: {e}")
#
#     # Clean up temporary QR SVG file
#     if os.path.exists(qr_svg_path):
#         os.remove(qr_svg_path)
#
#
# # Usage
# generate_qr_with_svg_overlay(
#     text="https://example.com",
#     overlay_svg_path="backend/utils/uGem.svg",  # Path to your SVG logo
#     output_svg_path="qr_with_logo.svg",  # Path for the final SVG


#     output_png_path="qr_with_logo.png"  # Path for the final PNG
# )

import segno
import cairosvg
import os
import io


def generate_qr_with_svg_overlay(text, overlay_svg_path):
    """
    Generate a QR code with an SVG overlay on top and convert it to PNG.

    Args:
        text (str): The text or data for the QR code.
        overlay_svg_path (str): Path to the SVG file to overlay.

    Returns:
        bytes: The PNG image data.
    """
    # Generate the QR code as SVG in-memory
    qr = segno.make(text)
    qr_svg_buffer = io.StringIO()
    qr.save(qr_svg_buffer, kind='svg', scale=20)  # Save as SVG to in-memory buffer
    qr_svg_content = qr_svg_buffer.getvalue()

    # Remove XML declaration if present
    if qr_svg_content.startswith('<?xml'):
        qr_svg_content = qr_svg_content.split('?>', 1)[1].strip()

    # Load the overlay SVG content
    with open(overlay_svg_path, 'r') as overlay_file:
        overlay_content = overlay_file.read().strip()
        # Remove XML declaration if present
        if overlay_content.startswith('<?xml'):
            overlay_content = overlay_content.split('?>', 1)[1].strip()

    # Combine the SVGs
    svg_template = f"""<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="680" height="820" viewBox="0 0 680 820">
        <!-- Add a rounded border -->
        <g transform="translate(8, 8)">  <!-- Adjust positioning and scale -->
            <rect x="1.5" y="1.5" width="660" height="800" rx="30" ry="30" fill="none" stroke="black" stroke-width="20"/>
        </g>

        <!-- QR Code -->
        <g transform="translate(10, 8)">  <!-- Adjust positioning and scale -->
            {qr_svg_content}
        </g>

        <!-- Overlay positioned at the center -->
        <g transform="translate(150, 620) scale(1.6)">  <!-- Adjust positioning and scale -->
            {overlay_content}
        </g>
    </svg>
    """

    # Optional: If you still want to save the combined SVG to a file, uncomment the following lines
    # output_svg_path = "qr_with_logo.svg"
    # with open(output_svg_path, 'w') as output_file:
    #     output_file.write(svg_template.strip())
    # print(f"QR code with overlay saved to {output_svg_path}")

    # Convert the combined SVG to PNG in-memory
    try:
        png_output = cairosvg.svg2png(bytestring=svg_template.encode('utf-8'))
        print(f"PNG version generated successfully.")
        return png_output  # Return PNG data as bytes
    except Exception as e:
        print(f"Error converting SVG to PNG: {e}")
        return None


# Usage Example
# if __name__ == "__main__":
#     png_data = generate_qr_with_svg_overlay(
#         text="https://example.com",
#         overlay_svg_path="backend/utils/uGem.svg"  # Path to your SVG logo
#     )
#
#     if png_data:
#         # Example: Save the PNG data to a file (optional)
#         with open("qr_with_logo.png", "wb") as png_file:
#             png_file.write(png_data)
#         print("PNG file saved as qr_with_logo.png")
