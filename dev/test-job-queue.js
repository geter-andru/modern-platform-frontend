#!/usr/bin/env node

/**
 * Test script for job queue system
 * 
 * This script tests the job queue functionality with real job processing.
 * Run with: node test-job-queue.js
 */

console.log('🧪 Testing Job Queue System...\n');

async function testJobQueue() {
  try {
    // Test basic job queue creation and management
    console.log('📋 Testing basic job operations...');
    
    // Test job creation
    const response1 = await fetch('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test-user-123'
      },
      body: JSON.stringify({
        type: 'ai-processing',
        data: {
          prompt: 'What is the capital of France?',
          userId: 'test-user-123',
          model: 'claude-3-sonnet'
        },
        options: {
          priority: 5
        }
      })
    });

    if (!response1.ok) {
      console.error('❌ Job creation failed:', response1.status);
      return false;
    }

    const jobResult = await response1.json();
    console.log('✅ AI Processing job created:', jobResult.data.jobId);

    // Test file generation job
    const response2 = await fetch('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test-user-123'
      },
      body: JSON.stringify({
        type: 'file-generation',
        data: {
          type: 'csv',
          content: [
            { name: 'John', age: 30, city: 'New York' },
            { name: 'Jane', age: 25, city: 'London' }
          ],
          fileName: 'test-data.csv',
          userId: 'test-user-123'
        }
      })
    });

    if (!response2.ok) {
      console.error('❌ File generation job creation failed:', response2.status);
      return false;
    }

    const fileJobResult = await response2.json();
    console.log('✅ File generation job created:', fileJobResult.data.jobId);

    // Test email job
    const response3 = await fetch('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test-user-123'
      },
      body: JSON.stringify({
        type: 'email',
        data: {
          to: 'test@example.com',
          subject: 'Test Email from Job Queue',
          template: 'Hello {{name}}, this is a test email generated at {{timestamp}}.',
          variables: {
            name: 'Test User',
            timestamp: new Date().toISOString()
          },
          userId: 'test-user-123'
        }
      })
    });

    if (!response3.ok) {
      console.error('❌ Email job creation failed:', response3.status);
      return false;
    }

    const emailJobResult = await response3.json();
    console.log('✅ Email job created:', emailJobResult.data.jobId);

    // Wait a moment for processing
    console.log('\n⏳ Waiting for jobs to process...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check job statuses
    console.log('\n📊 Checking job statuses...');

    const jobs = [jobResult.data.jobId, fileJobResult.data.jobId, emailJobResult.data.jobId];

    for (const jobId of jobs) {
      const statusResponse = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
        headers: {
          'x-user-id': 'test-user-123'
        }
      });

      if (statusResponse.ok) {
        const status = await statusResponse.json();
        console.log(`✅ Job ${jobId}: ${status.data.status} (${status.data.progress}% complete)`);
        
        if (status.data.result) {
          console.log(`   Result preview: ${JSON.stringify(status.data.result).slice(0, 100)}...`);
        }
      } else {
        console.log(`❌ Failed to get status for job ${jobId}`);
      }
    }

    // Test queue statistics
    console.log('\n📈 Queue Statistics:');
    const statsResponse = await fetch('http://localhost:3000/api/jobs?stats=true');
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log(`   Active: ${stats.data.active}`);
      console.log(`   Waiting: ${stats.data.waiting}`);
      console.log(`   Completed: ${stats.data.completed}`);
      console.log(`   Failed: ${stats.data.failed}`);
      console.log(`   Average Processing Time: ${stats.data.averageProcessingTime}ms`);
    }

    // Test data analysis job
    console.log('\n📊 Testing data analysis job...');
    const analysisResponse = await fetch('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test-user-123'
      },
      body: JSON.stringify({
        type: 'data-analysis',
        data: {
          dataSource: 'test-dataset',
          analysisType: 'summary',
          parameters: {
            columns: ['value', 'category'],
            groupBy: 'category'
          },
          userId: 'test-user-123',
          outputFormat: 'json'
        }
      })
    });

    if (analysisResponse.ok) {
      const analysisResult = await analysisResponse.json();
      console.log('✅ Data analysis job created:', analysisResult.data.jobId);
    }

    console.log('\n🎉 All job queue tests completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Check if we're running a development server
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    if (response.ok) {
      console.log('✅ Development server is running');
      return true;
    } else {
      console.log('❌ Development server returned:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Development server is not running');
    console.log('Please start the development server with: npm run dev');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    process.exit(1);
  }

  const success = await testJobQueue();
  process.exit(success ? 0 : 1);
}

main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});