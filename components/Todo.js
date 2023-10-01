import React, { useState, useEffect } from 'react';
import { 
  View, Text, Button, TextInput, Alert, ScrollView, Pressable } 
  from 'react-native';
import { child, onValue, push, query, ref, update } from 'firebase/database';
import { db, TODOS_REF, USERS_REF } from '../firebase/Config';
import { TodoItem } from './TodoItem';
import { MaterialIcons } from '@expo/vector-icons';
import { logout, removeUser } from './Auth';
import styles from '../style/style';

export default Todo = ({ navigation, route }) => {

  const [userKey, setUserKey] = useState('');
  const [nickname, setNickname] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState({});
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');

  useEffect(() => {
    setUserKey(route.params.userUid);
    const userRef = query(ref(db, USERS_REF + route.params.userUid));
    onValue(userRef, (snapshot) => {
      snapshot.val() 
        ? setNickname(snapshot.val().nickname)
        : setNickname("")
      const todoItemsRef = ref(db, TODOS_REF + snapshot.key);
      onValue(todoItemsRef, (snapshot) => {
        const data = snapshot.val() ? snapshot.val() : {};
        const todoItems = {...data};
        setTodos(todoItems);
      });
    });
  }, []);
  
  const addNewTodo = () => {
    if (newTodo.trim() !== "") {
      const newTodoItem = {
        done: false,
        todoItem: newTodo
      };
      const newTodoItemKey = push(child(ref(db), TODOS_REF + userKey)).key;
      const updates = {};
      updates[TODOS_REF + userKey + "/" + newTodoItemKey] = newTodoItem;
      setNewTodo('');
      return update(ref(db), updates);
    }
  }

  const removeTodos = () => {
    const removes = {};
    removes[TODOS_REF + userKey] = null;
    return update(ref(db), removes);
  }

  const handlePress = () => {
    logout();
    navigation.navigate('Welcome');
  };

  const handlePressShowDelete = () => {
    setShowDeleteAccount(!showDeleteAccount);
  }

  const handlePressDelete = () => {
    if (confirmDelete !== "DELETE") {
      Alert.alert('You must type DELETE to confirm.');
    }
    else {
      removeUser();
      navigation.navigate('Welcome');
    }
  }

  const createTwoButtonAlert = () => Alert.alert(
    "Todolist", "Remove all items?", [{
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel"
    },
    { 
      text: "OK", onPress: () => removeTodos()
    }],
    { cancelable: false }
  );

  let todosKeys = Object.keys(todos);

  return (
    <View 
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}>
      <View style={styles.headerItem}>
        <Text style={styles.header}>Todolist ({todosKeys.length})</Text>
        <Pressable style={styles.logoutIcon} onPress={handlePress}>
          <MaterialIcons name="logout" size={24} color="black" />
        </Pressable>
      </View>
      <Text style={styles.infoText}>Hello, {nickname}</Text>
      <View style={styles.newItem}>
        <TextInput
          placeholder='Add new todo'
          value={newTodo}
          style={styles.textInput}
          onChangeText={setNewTodo}
        />
      </View>
      <View style={styles.buttonStyle}>
        <Button 
          title="Add new Todo item"
          onPress={() => addNewTodo()}
        />
      </View>
      <ScrollView>
        {todosKeys.length > 0 ? (
          todosKeys.map(key => (
          <TodoItem
            key={key}
            todoItem={todos[key]}
            id={key}
            userKey={userKey}
          />
        ))
        ) : (
          <Text style={styles.infoText}>There are no items</Text>
        )}
        <View style={styles.buttonStyle}>
          <Button 
            title="Remove all todos" 
            onPress={() => createTwoButtonAlert()} />
        </View>
        <View style={styles.buttonStyle}>
          <Button 
            title="Change password"
            onPress={() => 
              navigation.navigate('ChangePw', {nickname: nickname}) } />
        </View>
        <Pressable style={styles.buttonStyle}>
          <Text 
            style={styles.link}
            onPress={handlePressShowDelete}>Delete account</Text>
        </Pressable>
        { showDeleteAccount &&
          <>
            <TextInput
              style={styles.textInput}
              placeholder="Type DELETE here to confirm"
              value={confirmDelete}
              onChangeText={(confirmDelete) => setConfirmDelete(confirmDelete)}
              autoCapitalize="characters"
            />
            <Pressable style={styles.buttonStyle}>
              <Button
                title="Delete account"
                onPress={() => handlePressDelete()} />
              </Pressable>
            <Text style={styles.infoText}>
              Your data will be removed from the database!
            </Text>
          </>
        }
      </ScrollView>
    </View>
  );
}