import WelcomeScreen from "./pages/WelcomeScreen";
import background from './assets/images/wood_bg.jpg';

export default function(){
    return (
        <div style={{backgroundImage: `url(${background})`}}>
            <WelcomeScreen/>
        </div>
    )
}
