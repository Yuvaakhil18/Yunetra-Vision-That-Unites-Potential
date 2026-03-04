import ProfileClient from "../ProfileClient";

export default function PublicProfilePage({ params }: { params: { userId: string } }) {
    // Renders the Profile Client passing the resolved dynamic param as target ID explicitly
    return <ProfileClient userId={params.userId} />;
}
