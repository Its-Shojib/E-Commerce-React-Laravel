import { Banner } from "./Banner";
import Effect from "./Effect";
import Premium from "./Premium";
import Review from "./Review";


const Home = () => {
    return (
        <div className="max-w-screen-2xl mx-auto bg-[#f3f9fc]">
            <Banner />
            <Effect />
            <Premium />
            <Review />
        </div>
    );
};

export default Home;