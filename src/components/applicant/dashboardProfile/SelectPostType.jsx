import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box, Typography } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};



export default function SelectPostType({ names, label, selectedValue, onChange, isEdit }) {
    const handleChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <>
            {label && <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 1,
                }}
            >
                <Typography
                    sx={{
                        fontSize: { xs: "12px", sm: "15px", md: "16px" },
                        fontWeight: 500,
                        lineHeight: { xs: "12px", sm: "20px" },
                        color: '#222222',
                    }}
                >
                    {label && label}
                </Typography>
            </Box>}
            <FormControl
                sx={{
                    fontSize: { xs: '12px', sm: '14px', md: '16px' },
                    fontWeight: 300,
                    lineHeight: { xs: '25px', sm: '30px', md: '24px', lg: '18px' },
                    color: '#222222'
                }}
            >
                <Select
                    sx={{
                        textDecoration: 'none',
                        border: 'none',
                        boxShadow: 'none',
                        '.MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                        '.css-1u4kwaj-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
                            pt: 1,
                            pb: 1,
                            pl: 0
                        },
                        fontSize: { xs: "12px", sm: "15px", md: "16px" },
                        fontWeight: 300,
                        lineHeight: { xs: "12px", sm: "20px" },
                        color: '#222222',
                        padding: 0
                    }}
                    displayEmpty
                    value={selectedValue}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    disabled={isEdit}
                    renderValue={(selected) => {
                        return selected;
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    {names?.map((name) => (
                        <MenuItem key={name} value={name} sx={{
                            color: '#222222', fontSize: { xs: "12px", sm: "15px", md: "16px" },
                            fontWeight: 500,
                            lineHeight: { xs: "12px", sm: "20px" },
                        }}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}

