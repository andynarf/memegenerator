import { useEffect, useState } from "react";
import "./App.css";
import Meme from "./components/Meme";

const objectToQueryParam = (obj) => {
  const params = Object.entries(obj).map(([key,value]) => `${key}=${value}`)
  return '?' + params.join('&')
}


function App() {
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [topText, settopText] = useState("");
  const [bottomText, setbottomText] = useState("");
  const [meme, setMeme] = useState(null)

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes").then((data) =>
      data.json().then((response) => setTemplates(response.data.memes))
    );
  }, []);
  if (meme) {
    return <img src={meme} alt='custom meme'></img>
  }
  return (
    <div className="App">
      {template && (
        <form
          onSubmit={ async e => {
            e.preventDefault();
            //add logic to create meme from api
            const params ={
              template_id: template.id,
              text0: topText,
              text1: bottomText,
              username: 'andynarf',
              password: 'mermelada31',
            }
            const response = await fetch(
              `https://api.imgflip.com/caption_image${objectToQueryParam(params)}`)
            const json = await response.json()
            setMeme(json.data.url)
            // console.log(json.data.url)
          }}
        >
          <h1> {template.name}</h1>
          <Meme template={template} />
          <input
            placeholder="top text"
            value={topText}
            onChange={(e) => settopText(e.target.value)}
          />
          <input
            placeholder="bottom text"
            value={bottomText}
            onChange={(e) => setbottomText(e.target.value)}
          />
          <button type="submit">create meme</button>
        </form>
      )}
      {!template && (
        <>
          <h1>Pick a Template</h1>
          {templates.map((item) => {
            return <Meme template={item} onClick={() => setTemplate(item)} />;
          })}
        </>
      )}
    </div>
  );
}

export default App;
