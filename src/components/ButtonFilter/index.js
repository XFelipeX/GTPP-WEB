import React from "react";
import './style.css'
import {AiTwotoneFilter} from 'react-icons/ai';

export default function ButtonFilter() {
  return (
    <div className="buttonFilterArea">
      <button className="buttonFilter"><AiTwotoneFilter size={50} style={{color:"#959595"}} /></button>
    </div>
  );
}
