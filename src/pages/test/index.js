import React, {useEffect, useState} from "react";

export default function Index() {
    const [click, setClick] = useState(false);
    const [xy, setXY] = useState([]);
    let [canvas, setCanvas] = useState(null);

    const onMouseMove = (e) => {
        if (click) {
            setXY([
                ...xy,
                {
                    x: e.pageX,
                    y: e.pageY
                }
            ])

            if (canvas.getContext) {
                let context = canvas.getContext('2d');
                context.beginPath();
                context.lineJoin = "round";
                xy.forEach((obj, index) => {
                    if (index === 0)
                        context.moveTo(obj.x, obj.y);
                    else
                        context.lineTo(obj.x, obj.y);
                });
                context.lineWidth = 3;
                context.strokeStyle = "#ff747b";
                context.stroke();

            }
        }


    };

    const onClick = (e) => {
        setClick(!click)
    };


    useEffect(() => {
        setCanvas(document.getElementById('draw'))
    }, []);


    return (
        <div
            style={{
                height: 500,
                width: 1000,
                backgroundColor: '#d7ffdf'
            }}
            onMouseMove={(e) => {
                onMouseMove(e)
            }}
            onClick={(e) => onClick(e)}
        >
            <canvas
                style={{position: "absolute", left: 0, top: 0,}}
                id="draw"
                width="1000"
                height="500"
            />

        </div>
    )

}
