import { View, StyleSheet, FlatList, SafeAreaView, Pressable, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native'
import { Button, Card, Text, FAB, Modal, Portal, PaperProvider, TextInput } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';



export default function HomePage({ onLogout, user_id }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        LoadData();
    })

    const onPressLogout = () => {
        onLogout(); // Call the logout function
    };


    //Home page ekata data load karala dena function eka
    const LoadData = () => {
        fetch('http://192.168.43.210:3000/api/notes/get_notes/' + user_id)
            .then((response) => response.json())
            .then((json) => setData(json));
    };
    //long press ekedi call wena delete note eka
    const deleteNote = (noteId) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this note?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://192.168.43.210:3000/api/notes/delete_note/${noteId}`, {
                                method: 'DELETE',
                            });
                            const data = await response.json();
                            console.log('Note deleted:', data);


                            const updatedData = data.filter(item => item.notes_id !== noteId);
                            setData(updatedData);
                        } catch (error) {
                            console.error('Error deleting note:', error);
                        }
                    },
                },
            ]
        );
    };

    return (
        //main container
        <View style={styles.container}>

        
            <TouchableOpacity onPress={onPressLogout} style={styles.logOut}>
                <Text>LogOut</Text>
            </TouchableOpacity>

            <FAB
                style={styles.fab}
                label='Add+'
                onPress={() => setModalVisible(!modalVisible)}
            />
            {/*middle container */}
            <View style={styles.centeredView}>

                <FlatList style={styles.container}
                    data={data}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.cardstyle}>
                                <TouchableWithoutFeedback
                                    onLongPress={() => deleteNote(item.notes_id)}
                                >
                                    <Card mode='outlined' style={styles.cardstyle}>

                                        <Card.Content>
                                            <Text variant="titleLarge">{item.title}</Text>
                                            <Text variant="bodyMedium">{item.notes_text}</Text>
                                        </Card.Content>
                                        <Card.Cover source={{ uri: `http://192.168.43.210:3000/images/${item.image_url}` }} />
                                        <Card.Actions>

                                        </Card.Actions>
                                    </Card>
                                </TouchableWithoutFeedback>
                            </View>
                        )
                    }}
                    keyExtractor={item => item.notes_id}
                />
                {/* pop up eka */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>


                    <View>
                        <View style={styles.modalView}>
                            <Text style={styles.noteTxt}>Add New Note</Text>
                             <TextInput value={noteTitle} onChangeText={setNoteTitle} style={styles.TextInput} placeholder="Type title here" />
                             <TextInput value={noteText} onChangeText={setNoteText} style={styles.TextInputNote} placeholder="Type note here" />                        
                           


                            <Button onPress={() => launchCamera({}, (response) => {
                                if (response.didCancel) {
                                    console.log('User cancelled image picker');
                                }
                                else if (response.error) {
                                    console.log('ImagePicker Error: ', response.error);
                                }
                                else if (response.customButton) {
                                    console.log('User tapped custom button: ', response.customButton);
                                }
                                else {
                                    const { uri } = response.assets[0];
                                    setImageUri(uri);

                                    // console.log('Image URI: ', uri);
                                }
                            })}>Take Picture</Button>

                            <TouchableOpacity onPress={async () => {
                                if (noteText && imageUri) {
                                    const formData = new FormData();
                                    formData.append('image', {
                                        uri: imageUri,
                                        type: 'image/jpeg',
                                        name: 'image.jpg',
                                    });
                                    formData.append('notes_text', noteText);
                                    formData.append('user_id', user_id);
                                    formData.append('title', noteTitle);


                                    try {
                                        const response = await fetch('http://192.168.43.210:3000/api/notes/save_notes', {
                                            method: 'POST',
                                            body: formData,
                                            headers: {
                                                'Content-Type': 'multipart/form-data',
                                            },
                                        });
                                        const data = await response.json();

                                        // Handle the response from the server as needed

                                        console.log('Data saved:', data);
                                    } catch (error) {
                                        console.error('Error uploading data:', error);
                                    }
                                }
                                setModalVisible(false);
                            }} style={styles.savebtn}>
                                <Text>Save</Text>
                            </TouchableOpacity>


                            <Pressable
                                style={styles.buttonClose}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>X</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

            </View>





        </View>


    )

}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        marginRight: 10,
        right: 0,
        
        marginTop:10
        
    },
    fabtext:{
        
    },
    container: {
        flex: 1,
        backgroundColor: 'dark-blue',
        minWidth: 370
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,

    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 100,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 350,
       
    },
cardstyle:{
marginBottom:10
},

    buttonClose: {
        backgroundColor: '#2196F3',
        position: 'absolute',

        right: 10,
        padding: 10,
        marginBottom: 100,
        marginTop: 10
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    notetext: {
        width: 300

    },
    logOut:{
        color:"blue",
        padding:10
    },
  
      TextInput: {
        height: 40,
        width:300,
        marginBottom: 20,
      },
      TextInputNote: {
        height:100,
        width:300,
        marginBottom: 20,
      },
      noteTxt:{
        marginTop:-10,
        marginBottom:20,
        borderRadius:50,
        fontFamily:"Baskerville-Bold",
        fontSize:20
      },
      savebtn:{
        marginTop:20,
            width:100,
            backgroundColor:'blue',
            alignContent:'center',
            alignItems:'center',
            borderRadius:100,
            
            padding:10,
      }
})