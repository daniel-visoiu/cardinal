import {Component, Element, h, State} from "@stencil/core";

@Component({
  tag: "psk-tag",
  styleUrl: "./page.css"
})

export class PskTag {

  @State() componentCode:string="";
  @Element() host: HTMLDivElement;

  componentWillLoad(){

    this.componentCode = this.host.innerHTML;
    this.host.innerHTML = '';
  }

  render() {
    return (
      <psk-card title={"HTML Tag"}>
          <pre class="text-center code-tag">
              <code class="language-html code-tag" data-lang="html">
                <span class="nt">{this.componentCode}</span>
              </code>
            </pre>
      </psk-card>
    )
  }


}
