import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export const Dropdown: React.FC<Props> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const renderOptions = () => {
    return (
      <View>
        {options.map(option => (
          <TouchableOpacity onPress={() => handleOptionSelect(option)}>
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleDropdown}>
        <Text>{value}</Text>
      </TouchableOpacity>
      {isOpen && renderOptions()}
    </View>
  );
};
