import React from 'react';
import './App.css';
import { Dropdown, option } from './components/Dropdown';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const App: React.FC = () => {
  const [selectedOption, setSelectedOption] = React.useState<option>();
  const [selectedOption2, setSelectedOption2] = React.useState<option>({ value: 'vanilla', label: 'Vanilla' });
  const [selectedOption3, setSelectedOption3] = React.useState<option[]>([{ value: 'vanilla', label: 'Vanilla' }]);
  
  return (
    <div style={{ width: 500, margin: '0px auto', paddingTop: 10 }}>

      <Dropdown
        options={options}
        placeholder={'Choose'}
        selected={selectedOption}
        onChange={(option) => setSelectedOption(option)}
      />
      <Dropdown
        options={options}
        placeholder={'Search'}
        selected={selectedOption2}
        onChange={(option) => setSelectedOption2(option)}
        searchable
      />

      <Dropdown
        multiselect
        options={options}
        placeholder={'Search and choose'}
        selectedList={selectedOption3}
        onChangeMultiselect={(option) => setSelectedOption3(option)}
        searchable
      />

    </div>
  );
}

export default App;
