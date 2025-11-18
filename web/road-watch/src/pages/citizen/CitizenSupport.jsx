import './styles/CitizenSupport.css';
import { SupportIcon } from '../../components/common/Icons.jsx';

const CitizenSupport = () =>
{
    return (
        <div className="citizensupport-container">
            <h3> Share your feedback or get help with using RoadWatch </h3>

            <form>
                <h4> Submit New Feedback </h4>

                <div className="citizensupport-input">
                    <label> Category </label>
                    <select>
                        <option> </option>
                        <option> Pothole </option>
                        <option> Flooding </option>
                        <option> Debris </option>
                        <option> Crack </option>
                        <option> Other </option>
                    </select>
                </div>

                <div className="citizensupport-input">
                    <label> Title </label>
                    <input type="text" placeholder="Brief summary of your feedback" required/>
                </div>
                
                <div className="citizensupport-input">
                    <label> Description </label>
                    <textarea placeholder="Provide detailed information about your feedback" required rows="5"/>
                </div>

                <p className="support-info"> <SupportIcon/> Your feedback will be reviewed by our team. We typically respond within 2 - 3 business days. </p>
                <hr/>

                <div className="citizensupport-buttons">
                    <button> Cancel </button>
                    <button> Submit Feedback </button>
                </div>
            </form>
        </div>
    );
}

export default CitizenSupport;