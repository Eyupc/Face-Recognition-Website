import React from "react";
import { WSClient } from "../../websocket/WSClient";
import NavBar from "../static-parts/NavBar";
import imageCompression from 'browser-image-compression';


export class AddUserPage extends React.Component {
  
  private images_encoded: string[] = [];
  private reader = new FileReader();
  private WSClient:WSClient;
  private ws:WebSocket;

  constructor(props={}){
        super(props)
        this.WSClient = new WSClient("localhost",7777,false,"AddUserPage");
        this.ws = this.WSClient.websocket;
        this.ws.onmessage = (msg) => this.onMessage(msg)
    }
    
    onMessage(msg:any){
      
    }

    SendData(json:string){
      if(this.ws.OPEN === this.ws.readyState)
      this.ws.send((this.WSClient.encoder.encode(json)));
      else
      console.log("ERROR: Websocket connection is closed")
    }
    
    
    async fileSelectedHandler(e:any):Promise<void> {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true
      }

        var img:string = "";
        for(let i = 0; i<=e.target.files.length-1; i++){
        let t = e.target.files[i].type.split('/').pop().toLowerCase();
        if (t != "jpeg" && t != "jpg" && t != "png" && t != "bmp" && t != "gif")
        continue;
    
        let compressedFile = await imageCompression(e.target.files[i], options);
        //console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); //
        await this.getBase64(compressedFile).then((data:any)=>{
          img = data.replace("data:", "").replace(/^.+,/, "");

          this.images_encoded.push(img);
          document.getElementById("img")!.setAttribute("src",'data:image/jpg;base64,'+img)
          //console.log(this.state.images_encoded)

          //document.getElementById("image")!.setAttribute("src",img);
                    
        })
      }
    }

       getBase64(file:any) { //TODO -> image size reduce
        return new Promise((resolve, reject) => {
          const reader = this.reader;
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      onSubmit(e:any){
        if(this.images_encoded.length == 0)
          return;

        let json = {
          header:"AddUserEvent",
          data:[{
            "id":this.WSClient.userId,
            "name":(document.getElementById("name") as HTMLInputElement)!.value,
            "lastname":(document.getElementById("lastname") as HTMLInputElement)!.value,
            "age":(document.getElementById("age") as HTMLInputElement)!.value,
            "images":this.images_encoded,
          }]
        }
        this.SendData(JSON.stringify(json));
        (document.getElementById("name") as HTMLInputElement)!.value = "";
        (document.getElementById("lastname") as HTMLInputElement)!.value = "";
        (document.getElementById("age") as HTMLInputElement)!.value = "";
        (document.getElementById("files") as HTMLInputElement)!.value = "";
        e.preventDefault();
      }

    render(){
        return(
        <form onSubmit={(e)=>this.onSubmit(e)} ><div className="flex flex-col justify-center items-center h-screen">
        <div className="md:flex box-border h-72 w-auto h-auto p-4 border-4 bg-slate-200	-500 m4 rounded">
            <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-col">
                  <NavBar/>

  <div className="md:w-auto p-4">
  <div className="md:flex md:items-center mb-6">

<div className="md:w-full">
<label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="Name">
        Name:
      </label>
<input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-200" id="name"  
type="text" name="Name" required/>
</div></div>

<div className="md:flex md:items-center mb-6">

<div className="md:w-full">
<label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="Lastname">
        Lastname: 
      </label>
<input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-200" id="lastname"  
type="text" name="Lastname" required/>
</div></div>

<div className="md:flex md:items-center mb-6">
    <div className="md:w-1/2">
    <label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="Age">
        Age:
      </label>
<input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-200" id="age"  
type="number" min="1" name="Age" required/>
</div></div>
<div className="md:flex md:items-center mb-6">
<div className="md:w-2/3">
<label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="Fotos">
        Foto's:
      </label>
        <input type="file" className="w-64"  id="files" accept="image/*"  name="file" multiple onChange={(e)=>this.fileSelectedHandler(e)} required/><br/>
</div></div>

  <div className="md:flex md:items-center">
<div className="md:w-1/6">
<input style={{cursor:"pointer"}} className="w-64 h-10 px-5 m-2 text-blue-100 transition-colors duration-150 bg-blue-400 rounded-lg focus:shadow-outline hover:bg-blue-500" type="submit" value="Verander!"/>
</div></div>
<img src="" id="img"></img>
</div>
                      </div>
                  </div></div></div></form>
        )
    }
}