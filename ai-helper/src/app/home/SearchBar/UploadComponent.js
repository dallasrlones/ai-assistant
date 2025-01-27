import { FaUpload } from "react-icons/fa";
import { useRef } from "react";

const uploadIconStyles = {
    marginRight: "10px",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
};

const hiddenFileInputStyles = {
    display: "none",
};

const UploadComponent = ({ loading, setSelectedFile }) => {
    const fileInputRef = useRef(null)
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]); // Set the selected file
    };

    const handleIconClick = () => {
        // Trigger the hidden file input when the icon is clicked
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <>
            <FaUpload
                style={{ ...uploadIconStyles, color: loading == true ? 'lightblue' : 'white' }}
                onClick={handleIconClick} // Trigger the file input dialog
            />
            <input
                disabled={loading}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={hiddenFileInputStyles} // Hidden input
            />
        </>
    )
};

export default UploadComponent;