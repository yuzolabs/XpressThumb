import { initialState } from './src/features/editor/state/initialState.js';
import { editorReducer, editorActions } from './src/features/editor/state/reducer.js';

// Test JSON serialization of initial state
console.log('Testing JSON serialization...');

try {
  // Test 1: Initial state is serializable
  const serialized = JSON.stringify(initialState);
  console.log('✓ Initial state serializes successfully');
  
  // Test 2: Deserialization works
  const parsed = JSON.parse(serialized);
  console.log('✓ Initial state deserializes successfully');
  
  // Test 3: Serialized state matches original
  if (JSON.stringify(parsed) === JSON.stringify(initialState)) {
    console.log('✓ Serialized state matches original');
  } else {
    console.error('✗ Serialized state does not match original');
    process.exit(1);
  }
  
  // Test 4: State with history is serializable
  let state = initialState;
  state = editorReducer(state, editorActions.setTextTitle('Test Title'));
  state = editorReducer(state, editorActions.setTextColor('#ff0000'));
  state = editorReducer(state, editorActions.setRatio('1:1'));
  
  const serializedWithHistory = JSON.stringify(state);
  console.log('✓ State with history serializes successfully');
  
  // Test 5: Verify no non-serializable objects
  const hasNonSerializable = serializedWithHistory.includes('ImageBitmap') ||
    serializedWithHistory.includes('HTMLImageElement') ||
    serializedWithHistory.includes('File {') ||
    serializedWithHistory.includes('function');
    
  if (!hasNonSerializable) {
    console.log('✓ No non-serializable objects found');
  } else {
    console.error('✗ Found non-serializable objects');
    process.exit(1);
  }
  
  console.log('\n✓ All JSON serialization tests passed!');
} catch (error) {
  console.error('✗ JSON serialization failed:', error);
  process.exit(1);
}
