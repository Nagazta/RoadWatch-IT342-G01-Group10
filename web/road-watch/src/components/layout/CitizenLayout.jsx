import { useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import Sidebar from '../common/Sidebar';
import Header from './Header';

const CitizenLayout = ({ children, activeMenuItem, pageTitle }) =>
{
    const navigate = useNavigate();

    const handleNavigate = (item) =>
    {
        if(item.path)
            navigate(item.path);
    };

    return (
        <>
            <MainLayout 
                sidebar={ <Sidebar role="citizen" activeItem={activeMenuItem} onNavigate={handleNavigate} /> } 
                header={ <Header pageTitle={pageTitle} userName="Citizen User" userRole="Citizen" notificationCount={1}/> }
            />
            {children}
        </>
    );
};

export default CitizenLayout;