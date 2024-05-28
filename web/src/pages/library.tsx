import { useSocketConnectionState } from "@/zustand/socket";
import { Container, Grid, Paper } from "@mui/material";

const PosterItem = () => (
    <Paper className="w-full h-full" />
)
export default function Library() {
    const rawSocket = useSocketConnectionState(state => state.rawSocket);
    return (
        <div>
            <Container maxWidth="md">
                <Grid container>
                    <Grid item>
                        <PosterItem />
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}