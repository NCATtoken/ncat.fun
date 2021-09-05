import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiHttpService } from 'src/services/api-http.service';
import { Proposal } from 'src/services/models.definitioins';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-propose',
  templateUrl: './propose.component.html',
  styleUrls: ['./propose.component.scss']
})
export class ProposeComponent implements OnInit, AfterViewInit {

  @Input() options?: any;
  @Output() created = new EventEmitter<boolean>();
  agree = false;
  sending = false;
  environment = environment;
  proposal: Proposal = { require_budget: false, has_expire: false };

  constructor(public session: SessionService, private router: Router, private http: ApiHttpService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    window.scroll(0, 0);
  }

  autogrow(e: Event) {
    let textArea = e.target as HTMLInputElement;
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = (textArea.scrollHeight + 20) + 'px';
  }

  cancel(e: Event) {
    e.stopPropagation();
    if (confirm('Are you sure?'))
      this.created.emit(false);
  }


  propose() {
    if (!this.agree) return;

    this.sending = true;

    let payload = Object.assign(this.proposal);

    this.http.post(environment.daoBaseurl + '/proposals', payload, this.options)
      .subscribe((res) => {
        this.sending = false;
        this.created.emit(true);
      }, (e) => {
        this.sending = false;
        if (e.error?.message) {
          alert(e.error.message);
          return;
        }
        else if (e.error?.errors) {
          try {
            alert(e.error.errors.map((a: any) => a.param + ": " + a.msg).join("\n"));
            return;
          } catch (e2) {
            //
          }
        }
        alert(e.message);
      });
  }
}
