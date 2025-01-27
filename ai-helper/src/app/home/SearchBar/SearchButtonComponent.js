import { FaSearch } from "react-icons/fa";
import { MdLightbulbOutline } from "react-icons/md";

const buttonStyles = {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    color: "white",
    border: "none",
    backgroundColor: "#313131",
};

const SearchButtonComponent = ({ loading, askApiHandler }) => {
    return (
        <button
            onClick={askApiHandler}
            disabled={loading}
            style={{
                ...buttonStyles,
                cursor: loading ? "not-allowed" : "pointer",
                color: loading ? "lightblue" : "white",
            }}
        >
            {loading ? (
                <MdLightbulbOutline style={{ marginRight: "5px", fontSize: "16px" }} />
            ) : (
                <FaSearch style={{ marginRight: "5px", fontSize: "16px" }} />
            )}
        </button>
    )
}

export default SearchButtonComponent;