import React, {useState} from 'react';
import ImageUploader from 'react-images-upload';
import Button from "@material-ui/core/Button";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import axios from 'axios';
import './styles.css';
import maker from '../../assets/maker.png'
import img1 from "../../assets/room1.jpg";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const BASE_URL = 'http://192.168.1.135:8080/';


const App = (props) => {
    const [picture, setPicture] = useState([]);
    const [image, setImage] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    const [cameraList, setCameraList] = useState([]);
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);
    const [openDialog, setOpenDialog] = React.useState(false);

    const onDrop = (picture) => {
        setPicture(picture);
        setImage(URL.createObjectURL(picture[0]));
    };

    function _onMouseMove(e) {
        if (0 < e.nativeEvent.offsetX < 500 && 0 < e.nativeEvent.offsetY < 500) {
            setTop(e.pageY - 30);
            setLeft(e.pageX - 9.26);
        }
    }

    function _onClickView(e) {
        if (showCamera) {
            setOpenDialog(true);
            // setCameraList([
            //     ...cameraList,
            //     {
            //         pageX: e.pageX,
            //         pageY: e.pageY,
            //         offsetX: e.nativeEvent.offsetX,
            //         offsetY: e.nativeEvent.offsetY
            //     }
            // ]);
            // setShowCamera(false)
        }
    }

    const onClick = () => {
        const uploaders = picture.map(image => {
            const data = new FormData();
            data.append("image", image, image.name);
            // Make an AJAX upload request using Axios
            return axios.post(BASE_URL + 'upload', data)
                .then(response => {
                    setPicture([])
                })
        });
        // Once all the files are uploaded
        axios.all(uploaders).then(() => {
            console.log('done');
        }).catch(err => alert(err.message));
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSubmitDialog = () => {
        setOpenDialog(false);
    };

    const renderMaker = (obj) => (
        <Tooltip title={obj.name} enterDelay={500} leaveDelay={200}>
            <img style={{position: "absolute", left: obj.pageX - 9.26, top: obj.pageY - 30, height: 30}}
                // onDoubleClick={() => {
                //     onClickCamera(obj);
                // }}
                 src={maker}
                 className="maker"
                 alt="maker"/>
        </Tooltip>
    )

    return (
        <div className='root'>
            <ImageUploader
                withIcon
                buttonText={picture.length > 0 ? 'Change image' : 'Choose image'}
                onChange={onDrop}
                label='Max file size: 5mb, accepted: jpg, png'
                imgExtension={['.jpg', '.png']}
                maxFileSize={5242880}
                // withPreview
                singleImage
            />

            {
                picture.length > 0 ?
                    <div>
                        {/*<h1>x:{top}, y:{left}</h1>*/}
                        <ButtonGroup color="primary" aria-label="outlined primary button group">
                            <Button
                                onClick={() => {
                                    setShowCamera(true)
                                }}
                            >
                                Add Camera
                            </Button>
                            <Button
                                onClick={() => {
                                    // console.log(cameraList)
                                }}
                            >
                                Edit Camera
                            </Button>
                            <Button
                            >
                                Delete Camera
                            </Button>
                            <Button
                                onClick={onClick}
                            >
                                Submit
                            </Button>
                            <Button
                                onClick={() => props.history.push('/')}
                            >
                                Cancel
                            </Button>
                        </ButtonGroup>
                        <div
                            className="div-preview"
                        >

                            <div
                                style={{
                                    backgroundImage: `url(${image})`,
                                    margin: 5
                                }}
                                className='image-preview'
                                onMouseMove={_onMouseMove}
                                onClick={_onClickView}
                            >
                                {cameraList.map(obj => renderMaker(obj))}
                                {
                                    showCamera ? <img style={{position: "absolute", left: left, top: top, height: 30}}
                                                      src={maker}
                                                      className="maker"
                                                      alt="maker"/> : false
                                }

                            </div>
                        </div>
                    </div>
                    :
                    false
            }

            <Dialog open={openDialog} fullWidth maxWidth='sm' aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Detail area</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter all field
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        // id="name"
                        label="Name"
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        // id="name"
                        label="URL"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitDialog} color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
};

export default App
