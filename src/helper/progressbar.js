import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';


export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 17,
    borderRadius: '40px',
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[200],
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800],
        }),
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: '40px',
        backgroundColor: 'primary',
        ...theme.applyStyles('dark', {
            backgroundColor: '#308fe8',
        }),
    },
}));