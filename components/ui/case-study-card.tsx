type CaseStudy = {
  title: string;
  industry: string;
  challenge: string;
  approach: string;
};

export function CaseStudyCard({ caseStudy }: { caseStudy?: CaseStudy }) {
  if (!caseStudy) {
    return (
      <div className="case-study-placeholder">
        <div className="case-study-graphic" aria-hidden="true">
          <div className="case-study-line line-one" />
          <div className="case-study-line line-two" />
          <div className="case-study-node case-node-one">BUSINESS</div>
          <div className="case-study-node case-node-two">CHALLENGE</div>
          <div className="case-study-node case-node-three">SOLUTION</div>
          <span className="case-study-connector connector-one" />
          <span className="case-study-connector connector-two" />
        </div>
        <div className="case-study-copy">
          <p className="case-study-label">Portfolio in progress</p>
          <h3>We’re building a portfolio of practical digital solutions designed around real business challenges.</h3>
          <p>
            We’ll share selected work here as real projects are ready to be presented.
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="case-study-placeholder case-study-published">
      <div className="case-study-copy">
        <p className="case-study-label">{caseStudy.industry}</p>
        <h3>{caseStudy.title}</h3>
        <p><strong>Challenge:</strong> {caseStudy.challenge}</p>
        <p><strong>Approach:</strong> {caseStudy.approach}</p>
      </div>
    </article>
  );
}
