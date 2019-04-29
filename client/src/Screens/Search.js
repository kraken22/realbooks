import React from "react";
import api from "../api";
import "./Search.css";
import "../components/ripple.css";
import { Link } from "react-router-dom";
import Spinner from "react-spinner-material";

class Search extends React.Component {
  state = { songs: [], searchValue: "", error: null, loading: false };

  componentDidMount() {
    let {
      location: { search }
    } = this.props;
    search = search.replace("%20", " ").slice(1);
    this.onSearch({ target: { value: search } });
  }

  onSearch = async ({ target: { value } }) => {
    const { history } = this.props;
    history.replace(`/?${value}`);
    this.setState({ searchValue: value, error: null, loading: true });
    if (value) {
      try {
        const response = await api.get(`/songs/${value}`);
        this.setState(prev => ({
          songs: value === prev.searchValue ? response : prev.songs,
          loading: value === prev.searchValue ? false : prev.loading,
          error: null
        }));
      } catch (error) {
        this.setState({ error: error.message, loading: false });
      }
    } else {
      this.setState({ songs: [], loading: false });
    }
  };

  renderSong = song => {
    return (
      <Link
        key={song.id}
        to={`/song/${song.id}`}
        style={{ textDecoration: "none" }}
      >
        <div className="song-list-box ripple">
          <p className="song-list-title">{song.song_name}</p>
          <p className="song-list-book-name">{`${song.book_name}, page ${
            song.page_number
          }`}</p>
        </div>
      </Link>
    );
  };

  render() {
    const { songs, searchValue, error, loading } = this.state;
    return (
      <div className="container">
        <h1>Search the Realbooks</h1>
        <input
          placeholder="Enter Song Name"
          className="search-box"
          type="text"
          value={searchValue}
          onChange={this.onSearch}
        />
        {error !== null && <p className="error-display">{error}</p>}

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginBottom: 5
            }}
          >
            <Spinner spinnerColor="#bcc8da" spinnerWidth={2} />
          </div>
        )}
        {songs.map(this.renderSong)}
        <p style={{ textAlign: "center", color: "#576374", marginTop: 50 }}>
          Made By Jordan Jantschulev
        </p>
      </div>
    );
  }
}

export default Search;
