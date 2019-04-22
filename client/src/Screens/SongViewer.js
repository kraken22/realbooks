import React from "react";
import IconButton from "../components/IconButton";
import { withRouter } from "react-router-dom";
import Spinner from "react-spinner-material";
import api from "../api";

class SongViewer extends React.Component {
  state = {
    loading: true,
    error: null,
    song: null
  };

  async componentDidMount() {
    const {
      match: {
        params: { songId }
      }
    } = this.props;
    try {
      const song = await api.get(`/song/${songId}`);
      this.setState({ song, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    const { song, loading, error } = this.state;
    const { history } = this.props;
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            marginBottom: 5,
            padding: 5,
            boxShadow: "0.5px 1.3px 4px #bcc8da"
          }}
        >
          <IconButton
            color="red"
            icon="clear"
            onClick={() => history.goBack()}
          />
          {song !== null && (
            <div style={{ flex: 1, overflow: "none" }}>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: 5
                }}
              >
                {song.song_name}
              </p>
              <p
                style={{
                  margin: 5,
                  fontSize: 15,
                  color: "#888",
                  textAlign: "center"
                }}
              >
                {`${song.book_name}, page ${song.page_number}`}
              </p>
            </div>
          )}
        </div>
        {error !== null && <p>{error}</p>}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh"
            }}
          >
            <Spinner spinnerColor="#0075ff" />
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          {song !== null &&
            Array(song.length)
              .fill(0)
              .map((v, i) => (
                <div style={{ width: "100%", maxWidth: 1000 }}>
                  <img
                    style={{ width: "100%" }}
                    src={`/realbooks/api/image/${
                      song.book_name
                    }/${song.page_number + i}`}
                    alt="sheet music page"
                  />
                </div>
              ))}
        </div>
      </div>
    );
  }
}

export default withRouter(SongViewer);
