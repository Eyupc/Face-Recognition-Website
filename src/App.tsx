import React, { Props } from "react";
import AppRoutes from "./routes/AppRoutes";


export class App extends React.Component {

    constructor(props = {}){
        super(props)
    }
    render(){
        return(<><AppRoutes/></>
        )
    }
}