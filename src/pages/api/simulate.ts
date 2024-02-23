import { spawn } from 'child_process';
import path from 'path';

export default async function handler(req, res) {
  let responseSent = false;

  if (req.method === 'POST') {
    try {
      const backendPath = path.join(process.cwd(), '..', 'edge-backend');
      const simulationProcess = spawn('python', ['main.py'], {
        cwd: backendPath, 
        env: process.env,
      });

      let simulationOutput = '';
      let timedOut = false;

      // Kill the process after a timeout (e.g., 5 seconds)
      const timeout = setTimeout(() => {
        simulationProcess.kill();
        timedOut = true;
      }, 5000);

      simulationProcess.stdout.on('data', (data) => {
        simulationOutput += data.toString();
      });

      simulationProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      simulationProcess.on('error', (error) => {
        clearTimeout(timeout);
        res.status(500).json({ success: false, message: error.message });
        responseSent = true;
      });

      simulationProcess.on('close', (code) => {
        clearTimeout(timeout);

        if (timedOut) {
          res.status(500).json({ success: false, message: 'Simulation timed out' });
        } else if (code === 0) {
          res.status(200).json({ success: true, output: simulationOutput });
        } else {
          res.status(500).json({ success: false, output: simulationOutput });
        }

        responseSent = true;
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
      responseSent = true;
    } finally {
      if (!responseSent) {
        res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}