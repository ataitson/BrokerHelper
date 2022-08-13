import React, {useState, useEffect} from 'react';
import { Modal, 
    StyleSheet, 
    Text, 
    View, 
    ScrollView, 
    Alert, 
    FlatList, 
    Image, 
    ImageBackground,
    Pressable, 
    TouchableOpacity, 
    Linking, 
    TextInput } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { API, DataStore, graphqlOperation, Storage } from 'aws-amplify'

import {Client, FileType, Files, PolicyCar, PolicyHome} from '../../../src/models';
import BackButton from '../../components/BackButton';
import CustomImageButton from '../../components/CustomImageButton';
import { Dropdown } from 'react-native-element-dropdown';
import * as DocumentPicker from 'expo-document-picker';

import SendForm from '../../assets/sendForm.png';
import Attachments from '../../assets/attachments.png';
import Reschedule from '../../assets/reschedule.png';
import NewProcess from '../../assets/newProcess.png';
import Step1 from '../../assets/step1.png';
import Step2 from '../../assets/step2.png';
import AddFile from '../../assets/addFile.png';
import FileListItem from '../../components/FileListItem';
import TouchableListItem from '../../components/TouchableListItem';
import GreenTick from '../../assets/green_tick.png';

function BookOfBusinessTwo(props) {
    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [fileTypes, setFileTypes] = useState([]);
    const [fileModalVisible, setFileModalVisible] = useState(false);
    const [value, setValue] = useState(null);
    const [pickedFile, setPickedFile] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [selectedFileURI, setSelectedFileURI] = useState();
    const [selectedFileType, setSelectedFileType] = useState();
    const [saving, setSaving] = useState(false);
    const [files, setFiles] = useState();
    const [fileBlobs, setFileBlobs] = useState([]);
    const [filesVisible, setFilesVisible] = useState(false);
    const [carPolicies, setCarPolicies] = useState([]);
    const [homePolicies, setHomePolicies] = useState([]);
    const [policiesToDisplay, setPoliciesToDisplay] = useState([]);
    const [notes, setNotes] = useState([]);
    const [notesModalVisible, setNotesModalVisible] = useState(false);
    const [newNote, setNewNote] = useState();
    const {
        control, 
        handleSubmit, 
        watch,
    } = useForm({defaultValues: {username: route?.params?.username}});
    const [statusNotes, setStatusNotes] = useState([]);
    const initialStatusNotes = [
        'Vehicle Registration',
        'Driver\'s License'
    ];
    let noteIndex = 0;

    const currentClient = route?.params?.currentClient;

    const onScreenLoad = async () => {
        setFileBlobs([]);
        setStatusNotes([]);
        setCarPolicies([]);
        setHomePolicies([]);
        setFileTypes([]);

        const client = await DataStore.query(Client, c=> c.email("eq", currentClient.email.toLowerCase()));

        if(client[0].notes != undefined && client[0].notes.length > 0){
            setNotes(client[0].notes);
        }
        else{
            setNotes([]);
        }

        const tempPolicies = [];
        
        const carPoliciesList = await DataStore.query(PolicyCar, pc => pc.client_id("eq", currentClient.email.toLowerCase()));
        if(carPoliciesList[0])
        {
            carPoliciesList.map((cp, i) => {
                const policyName = cp.vehicle_year + " " + cp.vehicle_make + " " + cp.vehicle_model;
                if(!checkPolicyNames(policyName))
                {
                    const tempPolicy = {
                        id: cp.id,
                        name: policyName,
                        value: cp.policy_value,
                        type: 'Car'
                    }

                    tempPolicies.push(tempPolicy);
                    policiesToDisplay.push(tempPolicy);
                }
            })
            setCarPolicies(carPoliciesList);
        }

        
        const homePoliciesList = await DataStore.query(PolicyHome, ph => ph.client_id("eq", currentClient.email.toLowerCase()));
        if(homePoliciesList[0])
        {
            homePoliciesList.map((hp, i) => {
                const policyName = hp.street_number + " " + hp.street_name + hp.unit_number != undefined ? " unit " + hp.unit_number : "";
                if(!checkPolicyNames(policyName))
                {
                    const tempPolicy = {
                        id: hp.id,
                        name: policyName,
                        type: 'Home'
                    }

                    tempPolicies.push(tempPolicy);
                    policiesToDisplay.push(tempPolicy);
                }
            })
            setHomePolicies(homePoliciesList);
        }

        const fileList = await DataStore.query(Files, f => f.client_id("eq", currentClient.email.toLowerCase()));

        if(fileList[0])
        {
            setFiles(fileList);
            Storage.configure({ level: 'private' });
            const tempBlobs = [];
            const tempStatusNotes = [];
            const tempFileTypes = [];

            await Promise.all(fileList.map( async (f, i) => {
                if(!checkFiles(fileList[i].file_name)){
                    const result = await Storage.get(fileList[i].file_url);
                    
                    tempBlobs.push(
                    {
                        client_id: fileList[i].client_id,
                        file_type_i: fileList[i].file_type_i,
                        file_name: fileList[i].file_name,
                        file_url: fileList[i].file_url,
                        file_extension: fileList[i].file_extension,
                        file_blob: result
                    });
                    tempFileTypes.push(fileList[i].file_type_i);

                    if(checkMissingFiles(fileList[i].file_type_i) === false)
                    {
                        tempStatusNotes.push({ label: n, value: i});
                    }
                }                
                
                setStatusNotes(tempStatusNotes);
            }));

            setFileBlobs(tempBlobs);   

            const fileTypesResult = await (await DataStore.query(FileType)).filter(f => !tempFileTypes.includes(f.file_type_name));
            const newFileTypesList = [];
            fileTypesResult.map((c, i) => {
                newFileTypesList.push({ label: c.file_type_name, value: i});
            });

            setFileTypes(newFileTypesList);

            console.log("File Type size " + fileTypes.length);
        }
        else{
            const tempStatusNotes = [];
            initialStatusNotes.map((n, i) => {
                tempStatusNotes.push({ label: n, value: i});
            });
            
            setStatusNotes(tempStatusNotes);

            const fileTypesResult = await DataStore.query(FileType);
            console.log(fileTypesResult.length);
            const tempFileTypes = [];
            
            fileTypesResult.map((c, i) => {
                tempFileTypes.push({ label: c.file_type_name, value: i});
            });
            setFileTypes(tempFileTypes);
        }
    }
    useEffect(() => {
        onScreenLoad();
    }, []);

    const checkFiles = (val) => {
        return fileBlobs.some(item => val.file_name === item.file_name);
    }

    const checkMissingFiles = (val) => {
        return initialStatusNotes.some(item => val === item);
    }

    const onFilePickerPressed = async () => {
        try{
            const localPickedFile = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'], 
                copyToCacheDirectory: true,
            })

            setPickedFile(localPickedFile);
            
            const fileToUpload = {
                client_id: currentClient.email,
                file_type_i: selectedFileType,
                file_name: localPickedFile.name,
                file_extension: localPickedFile.name.substring(localPickedFile.name.length-3)
            }

            setSelectedFile(fileToUpload);
            setSelectedFileURI(localPickedFile.uri);
        }       
        catch(e){
            console.log('Error');
        }
    }

    const onNewFilePressed = async () => {  
        setFileModalVisible(!fileModalVisible);        
        
        try{
            const fileTypesResult = await DataStore.query(FileType);
            const tempFileTypes = [];
            fileTypesResult.map((c, i) => {
                if(!checkFileTypes(c.file_type_name))
                    tempFileTypes.push({ label: c.file_type_name, value: i})
            })
            setFileTypes(tempFileTypes);
        }
        catch(e){

        }
    }    

    const onNewNotePressed = async () => {  
        setNotesModalVisible(!notesModalVisible);        
    }       

    const checkFileTypes = (val) => {
        return fileBlobs.some(item => val === item.file_type_i);
    }

    const checkPolicyNames = (val) => {
        return policiesToDisplay.some(item => val === item.name);
    }

    const onSavePressed = async () => {
        if(saving){
            return;
        }

        setSaving(true);

        try {
            const file = await fetch(selectedFileURI)
            const fileBlob = await file.blob();
            const fileName = currentClient.name + "-" + selectedFile.file_type_i + "-" + selectedFile.file_name;

            const upload = await Storage.put(fileName, fileBlob, {
              level: 'private',
              contentType: pickedFile.mimeType
            })

            selectedFile.file_url = upload.key;

            try {
                await DataStore.save(
                  new Files({
                    client_id: selectedFile.client_id,
                    file_type_i: selectedFile.file_type_i,
                    file_name: selectedFile.file_name,
                    file_url: selectedFile.file_url,
                    file_extension: selectedFile.file_extension
                  })
                );
                Alert.alert('Success!', 'New file saved.');
    
              } catch (e) {
                Alert.alert('Oops', e.message);
              }      
        } 
        catch (err) {
            console.log('error creating file:', err)
        }

        onScreenLoad();

        setFileModalVisible(!fileModalVisible);        
        setSaving(false);
    }

    const onSaveNotePressed = async (data) => {
        if(saving){
            return;
        }

        setSaving(true);

        try {
            const original = currentClient;
            const originalNotes = currentClient.notes;
            const newNotes = [];

            if(originalNotes != undefined && originalNotes.length > 1){
                originalNotes.map((n, i) => {
                    newNotes.push(n);
                })
            }

            newNotes.push(newNote);

            await DataStore.save(Client.copyOf(original, updated => {
                updated.notes = newNotes;
            }))

            Alert.alert('Success!', 'New note added.');
        } 
        catch (err) {
            console.log('Oops:', err)
        }

        onScreenLoad();

        setNotesModalVisible(false);
        setSaving(false);
    }

    const showConfirmDialog = (data) => {
        return Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove " + data.type + "?",
            [
            // The "Yes" button
            {
                text: "Yes",
                onPress: () => {
                    removeFiles(data);
                },
            },
            // The "No" button
            // Does nothing but dismiss the dialog when tapped
            {
                text: "No",
            },
            ]
        );
    };

    const onPolicyPressed = (data) => {

        const parameters = {
            currentClient: currentClient,
            processType: data.type,
            id: data.id
        }

        navigation.navigate('NewProcessScreenTwo', {parameters});
    }
    
    const removeFiles = async (data) => {
        const removedFile = await Storage.remove(data.url, { level: 'private' });
        
        const todelete = await DataStore.query(Files, f => f.client_id("eq", data.owner.email.toLowerCase()).file_type_i("eq", data.type));
        await DataStore.delete(todelete[0]);

        onScreenLoad();

        Alert.alert('Success!', data.type + ' removed successfully.');
    }

    const onNewProcessPressed = async (data) => {
        navigation.navigate('NewProcessScreenOne', {currentClient});
    }

    return (
        <>        
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.root}>  
                <View style={styles.header}>
                    <BackButton />
                    <View style={styles.headerDetails}>
                        <Text numberOfLines={4} style={styles.title}>{currentClient.name}</Text>
                        <Text numberOfLines={1} style={styles.email}>{currentClient.email}</Text>
                        <Text numberOfLines={1} style={styles.phone}>{currentClient.phone_number}</Text>
                    </View>       
                </View>
                <View style={styles.progressBar}>
                    <ImageBackground source={Step1} tintColor={ '#f5c242' } resizeMode='contain' style={styles.firstStep}>
                        <Text>Contact</Text>
                    </ImageBackground>
                    <ImageBackground source={Step1} tintColor={ (currentClient.quote_completed || policiesToDisplay.length > 0) ? '#f5c242' :'#fff'} resizeMode='contain' style={styles.firstStep}>
                        <Text>Quote</Text>
                    </ImageBackground>
                    <ImageBackground source={Step1} tintColor={ (currentClient.quote_completed || policiesToDisplay.length === 0 || policiesToDisplay === undefined) ? '#fff' : '#f5c242'} resizeMode='contain' style={styles.firstStep}>
                        <Text style={{fontSize: 12, alignSelf: 'center'}}>Negotiation</Text>
                    </ImageBackground>
                    <ImageBackground source={Step1} tintColor={ policiesToDisplay.length > 0 ? '#f5c242' :'#fff'} resizeMode='contain' style={styles.firstStep}>
                        <Text>Bind</Text>
                    </ImageBackground>
                    <ImageBackground source={Step1} tintColor={ '#fff'} resizeMode='contain' style={styles.firstStep}>
                        <Text>Renew</Text>
                    </ImageBackground>
                </View>
                <View style={styles.details}>
                    <View style={styles.status}>
                        <Text style={styles.detailsTitle}>Status</Text>
                    </View>
                    { statusNotes.length > 0 && 
                        <ScrollView style={styles.scrollView} contentContainerStyle={ styles.root}>
                        {
                            statusNotes.map((n, i) => (
                                <TouchableListItem key={i}  
                                    note
                                    policyName={"Missing " + n.label}>
                                </TouchableListItem>
                            ))
                        }
                        </ScrollView>
                    }
                    <View style={styles.products}>
                        <Text style={styles.detailsTitle}>Products: { policiesToDisplay.length }</Text>
                        {
                            carPolicies.length > 0 && 
                            <ScrollView style={styles.policiesResults}>
                            {
                                policiesToDisplay.map((p, i) => (
                                <TouchableListItem key={i}  
                                    policyType={p.type}
                                    policyName={p.name}
                                    policyValue={p.value}
                                    onPress={() => onPolicyPressed(p)}>
                                </TouchableListItem>
                                ))
                            }
                            </ScrollView>
                        }
                    </View>
                    <View style={styles.notes}>
                        <Text style={styles.detailsTitle}>Notes: { notes != undefined ? notes.length : 0 }</Text>
                        <TouchableOpacity style={styles.addFileTouchable} onPress={onNewNotePressed}>
                            <Image style={styles.addFileImage} source={AddFile} />
                        </TouchableOpacity>
                    </View>
                    {(notes != undefined && notes.length > 0) &&
                        <ScrollView style={styles.notesResults}>
                            {
                            notes.map((n, i) => (
                                <Text key={i}>- {n}</Text>
                            ))}
                        </ScrollView>
                    }
                    <View>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={notesModalVisible}
                            onRequestClose={() => {
                                setFileModalVisible(!fileModalVisible);
                            }}>

                            <View style={styles.header}>
                                <BackButton onPress={() => setNotesModalVisible(false)} />
                                <View style={styles.headerDetails}>
                                    <Text style={[styles.title, {width: '80%', textAlign: 'left'}]}> New note </Text>
                                </View>        
                            </View>
                            <View style={styles.notesWriter}>
                                <View style={ [styles.container, {borderColor: '#E8E8E8'}] }>
                                    <TextInput name='newnote' 
                                        onChangeText={(text) => setNewNote(text)}
                                        multiline={true} />
                                </View>
                                <CustomButton text={saving ? 'Saving...' : 'Save'} onPress={handleSubmit(onSaveNotePressed)}/>
                            </View>
                        </Modal>
                    </View>
                    
                    <View style={styles.files}>
                        <Text style={styles.detailsTitle}>Files</Text>
                        { fileTypes.length === 0 ? 
                            <Image style={styles.greenTick} source={GreenTick} />:
                            <TouchableOpacity style={styles.addFileTouchable} onPress={onNewFilePressed}>
                                <Image style={styles.addFileImage} source={AddFile} />
                            </TouchableOpacity> 
                        }
                    </View>
                    
                    {fileBlobs != undefined && 
                        fileBlobs.length > 0 &&
                        <ScrollView style={styles.results}>
                            {
                            fileBlobs.map((f, i) => (
                            <FileListItem key={i} style={{color: 'blue'}} 
                                fileType={f.file_type_i} 
                                fileExtension={f.file_name.substring(f.file_name.length-3)}
                                onPress={() => Linking.openURL(f.file_blob)}
                                onDeletePressed={() => showConfirmDialog({url: f.file_url, type: f.file_type_i, owner: currentClient})}
                                >
                                {f.file_name}
                            </FileListItem>
                            ))}
                        </ScrollView>
                    }
                    
                    
                    <View>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={fileModalVisible}
                            onRequestClose={() => {
                                setFileModalVisible(!fileModalVisible);
                            }}>

                            <View style={styles.header}>
                            <BackButton onPress={() => setFileModalVisible(false)} />
                                <View style={styles.headerDetails}>
                                    <Text style={[styles.title, {width: '100%', textAlign: 'center'}]}> Add file </Text>
                                </View>        
                            </View>

                            <View style={styles.filePicker}>
                                <Dropdown
                                    name='filePicker'
                                    style={[styles.dropdown]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={fileTypes}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={fileModalVisible ? 'Select file category' : '...'}
                                    searchPlaceholder="Search..."
                                    value={value}
                                    onChange={item => {
                                        setValue(item.value);
                                        setSelectedFileType(item.label)
                                    }}
                                />
                                <CustomInput name='name' placeholder={'Select File'} newValue={selectedFile === undefined ? '' : selectedFile.file_name} 
                                    onPress={onFilePickerPressed} control={control} />
                                <CustomButton text={saving ? 'Saving...' : 'Save'} onPress={handleSubmit(onSavePressed)}/>
                            </View>
                        </Modal>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.navigation}>
                <CustomImageButton source={Attachments} onPress={() => setFilesVisible(!filesVisible)}></CustomImageButton>
                <CustomImageButton source={NewProcess} onPress={handleSubmit(onNewProcessPressed)}></CustomImageButton>
                {/* <CustomImageButton source={SendForm}></CustomImageButton> */}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    addFileTouchable: {
        paddingLeft: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
        height: 35,
    },
    addFileImage: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    container: {
        backgroundColor: '#FFF',
        width: '100%',
        height: 150,

        borderColor: '#E8E8E8',
        borderWidth: 1,
        borderRadius: 5,

        paddingHorizontal: 10,
        marginVertical: 5
    },
    input: {
        height: 150,
    },
    notesWriter:{
        padding: 15,
        width: '100%'
    },
    details:{
        flexGrow: 1,
        padding: 10,        
        width: '100%',
    },
    dropdown: {
        height: 50,
        borderColor: '#051C60',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    filePicker: {
        padding: 15,
        paddingTop: 50,
        justifyContent: 'center',
        width: '100%'
    },
    form: {
        width: '100%',
    },
    go_button:{
        alignItems: 'center',
        width: '100%',
    },
    greenTick: {
        margin: 5,
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    header:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    headerDetails:{
        width: '100%',
        height: 100,
        justifyContent: 'center',
        flexWrap: 'wrap', 
    },
    link: {
        color: '#FDB075'
    },
    email:{
        alignSelf:'flex-start',
        textAlign: 'left',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        flexWrap: 'nowrap',
    },
    phone: {
        alignSelf:'flex-start',
        textAlign: 'left',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        flexWrap: 'nowrap',
    },
    progressBar:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        paddingLeft: 5,
        width: '100%',
        height: 60,
    },
    firstStep:{
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 65,
        height: 65,
    },
    steps: {
        width: 70,
        height: 70,        
        resizeMode: 'contain'
    },
    lastStep:{
        marginLeft: -17.5,
        width: 75,
        resizeMode: 'contain'
    },
    navigation: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    notesResults: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 5,
        padding: 5,
        flexGrow: 1
    },
    policiesResults: {
        padding: 5,
        width: '100%',
    },
    statusResults: {
        padding: 5,
        width: '100%',
    },
    results: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 5,
        padding: 5,
        flexGrow: 1,
        marginBottom: 10,
        width: '100%',
        
    },
    scrollView: {
        width: '100%',
        alignSelf: 'center',
        
    },    
    root: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20
    },
    text:{
        color: 'gray',
        marginVertical: 10
    },
    title: {     
        width: '80%',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        flexWrap: 'wrap', 
    },
    detailsTitle: {
        textAlign: 'left',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
    },
    status:{

    },
    products: {

    },
    notes: {
        flexDirection: 'row',
    },
    files: {
        flexDirection: 'row',
    },
});

export default BookOfBusinessTwo;