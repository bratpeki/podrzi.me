
import NavigationBar from "../../components/NavigationHeader";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";

function AdminViewReports() {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 gradient-style">

            <AdminHeader></AdminHeader>

            <div className="mt-16"></div>

            <div className="flex flex-col bg-white rounded-lg shadow-md w-2/5 h-full p-8 mt-20 items-center justify-center p-20">

                <h1 className="text-4xl font-bold text-cyan-900 mb-8 drop-shadow-md"> Pregled prijava </h1>

            </div>

        </div>

    );

}

export default AdminViewReports;
