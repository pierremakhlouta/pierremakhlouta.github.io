import { ArrowMarker, Box, DiagramFigure, Frame, Label, arrowProps } from "./diagram";

const arrow = arrowProps("ps-arrow");

export default function PsellsDiagram() {
  return (
    <DiagramFigure
      idPrefix="ps-diagram"
      title="PSells architecture"
      description="GitHub Actions builds images to GHCR and deploys to an EC2 server through OIDC and an SSM command. On EC2, nginx terminates TLS in front of the FastAPI app and PostgreSQL. Secrets come from Parameter Store, access is through Session Manager only, and backups go to an encrypted S3 bucket. Grafana Cloud checks the site from three regions. At home, phones reach the app on a Mac over Tailscale, and an hourly ETL rebuilds the analytics warehouse."
      viewBox="0 0 880 584"
      minWidth={760}
      caption="The public demo runs on AWS. The business itself runs on a Mac at home, reachable only over Tailscale. RDS and an Application Load Balancer are also defined in Terraform behind an on/off switch, kept off to stay within free credits."
    >
      <ArrowMarker id="ps-arrow" />

      {/* Outside traffic */}
      <Box x={260} y={14} w={160} h={44} title="Visitors (HTTPS)" />
      <Box x={500} y={14} w={190} h={52} title="Grafana Cloud" sub="checks from 3 regions" />
      <path d="M340 58 V150" {...arrow} />
      <path d="M500 40 H440 V150" {...arrow} />

      {/* Delivery */}
      <Frame x={10} y={116} w={190} h={198} label="Delivery" />
      <Box x={24} y={152} w={162} title="GitHub Actions" sub="6 workflows" />
      <Box x={24} y={240} w={162} title="GHCR" sub="images by digest" />
      <path d="M105 204 V238" {...arrow} />
      <path d="M186 266 H284" {...arrow} />
      <path d="M186 172 H268" {...arrow} />
      <Label x={226} y={160}>
        OIDC + SSM
      </Label>

      {/* AWS */}
      <Frame x={240} y={84} w={430} h={330} label="AWS, all 23 resources in Terraform" labelEnd />
      <Frame x={268} y={116} w={222} h={276} label="EC2" />
      <Box x={286} y={152} w={188} title="nginx" sub="TLS 1.3, HSTS, CSP" />
      <Box x={286} y={240} w={188} title="FastAPI app" sub="containers from GHCR" />
      <Box x={286} y={328} w={188} h={48} title="PostgreSQL" />
      <path d="M380 204 V238" {...arrow} />
      <path d="M380 292 V326" {...arrow} />

      <Box x={510} y={152} w={146} title="Parameter Store" sub="secrets" />
      <Box x={510} y={240} w={146} title="Session Manager" sub="no SSH" />
      <Box x={510} y={328} w={146} h={56} title="S3 backups" sub="encrypted, write-only" />
      <path d="M474 352 H508" {...arrow} />

      {/* Home network */}
      <Frame x={10} y={444} w={860} h={128} label="At home, private network only" dashed />
      <Box x={28} y={484} w={140} title="Phones" sub="personal devices" />
      <Box x={200} y={484} w={140} title="Tailscale" sub="members only" />
      <Box x={372} y={484} w={170} title="Mac" sub="app, PostgreSQL, launchd" />
      <Box x={574} y={484} w={120} title="Hourly ETL" sub="pandas" />
      <Box x={726} y={484} w={128} title="Warehouse" sub="star schema" />
      <path d="M168 510 H198" {...arrow} />
      <path d="M340 510 H370" {...arrow} />
      <path d="M542 510 H572" {...arrow} />
      <path d="M694 510 H724" {...arrow} />
    </DiagramFigure>
  );
}
