import { useNavigate } from "react-router-dom";

export default function GoToMyProfileButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/user-profile")}
            className="px-4 py-2 rounded bg-olive-800 text-cream-50 hover:bg-olive-700"
        >
            Mon profil(Test UserProfile)
        </button>
    );
}
