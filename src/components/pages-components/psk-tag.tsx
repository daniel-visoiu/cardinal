import {Component, h} from "@stencil/core";

@Component({
  tag: "psk-tag",
  styleUrl: "./page.css"
})

export class PskTag {


  render() {
    return (
      <psk-card title={"HTML Tag"}>
          <pre class="text-center">
              <code class="language-html" data-lang="html">
                <span class="nt"><slot/></span>
              </code>
            </pre>
      </psk-card>
    )
  }


}
