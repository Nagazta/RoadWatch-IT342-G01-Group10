import './styles/CitizenSubmit.css';

const CitizenSubmit = () =>
{
    return (
        <form className="citizen-submit">
            <div className="cs-header">
                <h2> Submit a New Report </h2>
                <p> Help improve road safety in your community by reporting damage or hazards </p>
            </div>
            
            <div className="cs-input"> 
                <h4> Report Title </h4>
                <input type="text" placeholder="Brief description of the issue (e.g., Large pothole on Main Street)" required/>
            </div>

            <div className="cs-input">
                <h4> Description </h4>
                <input type="text" required/>
            </div>

            <div className="cs-input">
                <h4> Category </h4>
                <select>
                    <option> </option>
                    <option> Pothole </option>
                    <option> Flooding </option>
                    <option> Debris </option>
                    <option> Crack </option>
                    <option> Other </option>
                </select>
            </div>

            <div className="cs-input">
                {/* TO DO: Add buttons for auto detecting location or picking it from a map */}
                <h4> Location </h4>
                <input type="text" placeholder="Enter street address or landmark" required/>
            </div>

            <div className="cs-input">
                {/* TO DO: Follow Figma design and allow dragging and dropping of images */}
                <h4> Photos </h4>
                <p> Upload up to 5 photos (JPEG/PNG, max 5MB each) </p>
                <input type="file" accept="image/*" multiple/>
            </div>

            <div className="cs-buttons">
                <button type="submit"> Submit </button>
                <button> Cancel </button>
            </div>
        </form>
    );
};

export default CitizenSubmit;