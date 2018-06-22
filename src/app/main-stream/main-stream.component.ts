import { Component, OnInit, HostListener } from '@angular/core';
import { MainStream } from '../models/MainStream';
import { StreamingService } from '../streaming.service';

@Component({
  selector: 'app-main-stream',
  templateUrl: './main-stream.component.html',
  styleUrls: ['./main-stream.component.css']
})

export class MainStreamComponent implements OnInit {

  private mainStream: MainStream = new MainStream;
  public tracks;
  private currentTrackIndex;
  public currentTrack;
  private isPlaying: Boolean;
  private shuffle = false;

  constructor(private streaming: StreamingService) { 
  }

  // Load more tracks if the user scrolled to the bottom of the page.
  @HostListener("window:scroll", [])
  onScroll() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          this.loadMoreTracks(false)
      }
  }

  ngOnInit() {
    this.streaming.getMainStream().subscribe( ms => {
        this.mainStream = <MainStream> ms;
        this.tracks = this.mainStream.collection;
    })
  }

  playTrack(track, trackIndex) {
    this.isPlaying = true;
    this.currentTrackIndex = trackIndex;
    this.currentTrack = track;
    this.streaming.play(track.id);
  }

  notNullOrigin(element, index, array) { 
    return element.origin != null; 
  } 

  loadMoreTracks(play) {
    this.streaming.loadMore(this.mainStream.next_href).subscribe( nextStream => {
      this.mainStream = <MainStream> nextStream;
      if (play) {
        this.playTrack(this.mainStream.collection[0].origin, this.currentTrackIndex)
      }
      this.tracks = this.tracks.concat(this.mainStream.collection);
      this.tracks = this.tracks.filter(this.notNullOrigin)
    })
  }

  play() {
    this.streaming.continue();
    this.isPlaying = true;
  }

  pause() {
    this.streaming.pause();
    this.isPlaying = false;
  }
  playNext() {
    if (this.shuffle) {
      this.shufflePlay();
    }
    if (this.currentTrackIndex == this.tracks.length -1) {
      this.loadMoreTracks(true)
    } else {
      this.playTrack(this.tracks[this.currentTrackIndex + 1].origin, this.currentTrackIndex + 1)
    }
  }

  playPrev() {
    if (this.shuffle) {
      this.shufflePlay();
    }
    if (this.currentTrack != 0) {
      this.playTrack(this.tracks[this.currentTrackIndex - 1].origin, this.currentTrackIndex - 1)
    }
  }

  shufflePlay() {
    this.shuffle = true;
    this.currentTrackIndex = Math.floor(Math.random() * this.tracks.length)
  }
}
