import './styles/CitizenReports.css';
import { SearchIcon, EyeIcon } from '../../components/common/Icons';

const CitizenReports = () =>
{
    // Placeholder data
    const citizenReports = 
    [
        {id: 0, title: 'Large pothole on Main Street', category: 'Pothole', status: 'Under Review', date: '1/15/2024', location: 'Main St & 5th Ave', class: 'under-review'},
        {id: 1, title: 'Cracked pavement near school', category: 'Crack', status: 'Resolved', date: '1/12/2024', location: 'School Rd, Block 3', class: 'resolved'},
        {id: 2, title: 'Debris blocking bike lane', category: 'Debris', status: 'Pending', date: '1/18/2024', location: 'Bike Path, Mile 2', class: 'pending'},
        {id: 3, title: 'Flooding after rain', category: 'Flooding', status: 'Rejected', date: '1/10/2024', location: 'Low St & Water Ave', class: 'rejected'},
        {id: 4, title: 'Road surface deterioration', category: 'Other', status: 'Under Review', date: '1/14/2024', location: 'Highway 101, Exit 5', class: 'under-review'}
    ];

    const showReports = citizenReports.map
    (
        (report) => 
            <tr key={report.id}>
                <td> {report.title} </td>
                <td> <p> {report.category} </p> </td>
                <td className={report.class}> <p> {report.status} </p> </td>
                <td> {report.date} </td>
                <td> {report.location} </td>
                <td> <button> <EyeIcon/> View </button> </td>
            </tr>
    );

    return (
        <div className="citizen-reports">
            <h3> Track and manage all your submitted road damage reports </h3>

            <div className="citizen-search-report">
                <div className="search-bar">
                    <input type="text" placeholder="Search by title, description, or location"/>
                    <button> <SearchIcon /> </button>
                </div>
                
                <div className="filters">
                    <select name="status" id="status"> 
                        <option value=""> All Statuses </option>
                        <option> Pending </option>
                        <option> Under Review </option>
                        <option> In Progress </option>
                        <option> Resolved </option>
                        <option> Rejected </option>
                    </select>

                    <select name="category" id="category">
                        <option value=""> All Categories </option>
                        <option> Crack </option>
                        <option> Pothole </option>
                        <option> Debris </option>
                        <option> Flooding </option>
                        <option> Other </option>
                    </select>

                    <button> Clear Filters </button>
                </div>
            </div>

            <div className="report-list">
                <table>
                    <thead>
                        <tr>
                            <th> Report </th>
                            <th> Category </th>
                            <th> Status </th>
                            <th> Date </th>
                            <th> Location </th>
                            <th> Actions </th>
                        </tr>
                    </thead>
                    <tbody>
                        {showReports}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CitizenReports;