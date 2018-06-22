import { Injectable } from '@angular/core';
import * as SC from 'soundcloud';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {

  oauth = '2-285395-141092087-jZxlmeGBuyONSu';
  public trackPlayer: any

  constructor(private http: HttpClient) { 
    SC.initialize({
      client_id: 'e7pCwTm0KONbBx2NoD5a0k3kP474wQnC',
      redirect_uri: 'http://www.samplewars.com/soundcloud-callback.html'
    });
  }

  getMainStream() {
    return this.http.get("http://api.soundcloud.com/me/activities/tracks/affiliated?oauth_token=" + this.oauth)
  }

  loadMore(next_href) {
    return this.http.get(next_href + '&oauth_token=' + this.oauth)
  }

  play(trackId) {
    this.trackPlayer = SC.stream('/tracks/' + trackId).then(function(player) {
      player.play();
      return player;
    });
  }

  continue() {
    this.trackPlayer._result.play();
  }

  pause() {
    this.trackPlayer._result.pause();
  }
}