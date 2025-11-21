import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import reportService from '../../services/api/reportService';
import './styles/CitizenSubmit.css';

const CitizenSubmit = () =>
{
    const navigate = useNavigate();
    const [formData, setFormData] = useState
    ({
        title: '',
        description: '',
        category: '',
        location: ''
    });

    const handleChange = (e) =>
    {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleCancel = () =>
    {
        navigate('/citizen/dashboard');
    };

    const handleSubmit = async(e) =>
    {
        e.preventDefault();

        const user = localStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        const name = parsedUser.name;
        
        const response = await reportService.createReport(formData, name);

        if(response.success)
        {
            console.log('Report submitted!');
            alert('Report submitted!');
            navigate('/citizen/reports');
        } 
    }

    return (
        <form className="citizen-submit" onSubmit={handleSubmit}>
            <div className="cs-header">
                <h2> Submit a New Report </h2>
                <p> Help improve road safety in your community by reporting damage or hazards </p>
            </div>
            {/* Report Title */}
            <div className="cs-input"> 
                <h4> Report Title </h4>
                <input 
                    id="title"
                    name="title"
                    type="text" 
                    placeholder="Brief description of the issue (e.g., Large pothole on Main Street)" 
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>
            {/* Report Description */}
            <div className="cs-input">
                <h4> Description </h4>
                <input 
                    id="description"
                    name="description"
                    type="text" 
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>
            {/* Report Category */}
            <div className="cs-input">
                <h4> Category </h4>
                <select id="category" name="category" value={formData.category} onChange={(e) => setFormData((prev) => ({...prev, category: e.target.value}))} required>
                    <option value=""> </option>
                    <option value="Pothole"> Pothole </option>
                    <option value="Flooding"> Flooding </option>
                    <option value="Debris"> Debris </option>
                    <option value="Crack"> Crack </option>
                    <option value="Other"> Other </option>
                </select>
            </div>
            {/* Report Address */}
            <div className="cs-input">
                {/* TO DO: Add buttons for auto detecting location or picking it from a map */}
                <h4> Location </h4>
                <input 
                    id="location"
                    name="location"
                    type="text" 
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter street address or landmark" 
                    required
                />
            </div>
            {/* Report Images */}
            <div className="cs-input">
                {/* TO DO: Follow Figma design and allow dragging and dropping of images */}
                <h4> Photos </h4>
                <p> Upload up to 5 photos (JPEG/PNG, max 5MB each) </p>
                <input type="file" accept="image/*" multiple/>
            </div>
            {/* Buttons */}
            <div className="cs-buttons">
                <button type="submit"> Submit </button>
                <button type="button" onClick={handleCancel}> Cancel </button>
            </div>
        </form>
    );
};

export default CitizenSubmit;