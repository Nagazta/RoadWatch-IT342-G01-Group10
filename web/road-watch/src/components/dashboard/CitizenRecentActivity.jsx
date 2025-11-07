import './styles/CitizenRecentActivity.css';
import { CircleFilledIcon } from '../common/Icons';

const CitizenRecentActivity = () =>
{
    // Placeholder data
    const recentActivity = 
    [
        {id: 0, title: 'Report Resolved', description: 'Cracked pavement near school', updated: '2 hours ago'},
        {id: 1, title: 'Status Update', description: 'Large pothole marked in-progress', updated: '5 hours ago'},
        {id: 2, title: 'New Report', description: 'Faded road markings submitted', updated: '1 day ago'}
    ];

    const showActivity = recentActivity.map
    (
        (activity) =>
            <li key={activity.id}>
                <h4> <span className="circle-icon"><CircleFilledIcon/></span> {activity.title} </h4>
                <p> {activity.description} </p>
                <p> {activity.updated} </p>
            </li>
    );

    return (
        <div className="citizen-recent-activity">
            <h3> Recent Activity </h3>

            <ul>
                {showActivity}
            </ul>
        </div>
    );
};

export default CitizenRecentActivity;