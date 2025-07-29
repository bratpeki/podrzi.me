
import NavigationBar from "../../components/NavigationHeader";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminHeader";

function AdminHomePage() {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 gradient-style">

            <AdminHeader></AdminHeader>

            <div className="mt-16"></div>

            <div className="flex flex-col bg-white rounded-lg shadow-md w-2/5 h-full p-8 mt-20 items-center justify-center p-20">

                <h1 className="text-4xl font-bold text-cyan-900 mb-8 drop-shadow-md"> Administratorski panel </h1>

                { /* TODO: Peki */ }
                <Link to={"/admin/viewAccounts"} className="button-style text-3xl w-72 h-20 mb-8 flex items-center justify-center">
                    Pregled korisnika
                </Link>

                { /* TODO: Pero */ }
                <Link to={"/admin/viewActions"} className="button-style text-3xl w-72 h-20 mb-8 flex items-center justify-center">
                    Pregled akcija
                </Link>

                { /* TODO: Peki */ }
                <Link to={"/admin/viewReports"} className="button-style text-3xl w-72 h-20 mb-8 flex items-center justify-center">
                    Pregled prijava
                </Link>

                { /* TODO */ }
                <Link to={"/admin/viewRefunds"} className="button-style text-3xl w-72 h-20 flex items-center justify-center text-center">
                    Pregled zahtjeva za povrat novca
                </Link>

            </div>

        </div>

    );

}

export default AdminHomePage;
