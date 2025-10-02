#!/usr/bin/env node

/**
 * FEATURE PRIORITY QUEUE MANAGER
 * Manages feature development queue based on target buyer value assessments
 * Ensures P0/P1 features get built first, P4 features are deprioritized
 */

const fs = require('fs');
const path = require('path');

const QUEUE_FILE = 'feature-priority-queue.json';
const ASSESSMENT_LOG = 'buyer-value-assessments.json';

class FeaturePriorityQueue {
  constructor() {
    this.queue = this.loadQueue();
    this.assessments = this.loadAssessments();
  }

  loadQueue() {
    try {
      if (fs.existsSync(QUEUE_FILE)) {
        return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load existing queue, starting fresh');
    }
    
    return {
      'P0 - Build First': [],
      'P1 - High Priority': [],
      'P2 - Medium Priority': [],
      'P3 - Low Priority': [],
      'P4 - Deprioritize': []
    };
  }

  loadAssessments() {
    try {
      if (fs.existsSync(ASSESSMENT_LOG)) {
        return JSON.parse(fs.readFileSync(ASSESSMENT_LOG, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load existing assessments, starting fresh');
    }
    
    return [];
  }

  addFeature(assessment) {
    const feature = {
      name: assessment.feature,
      description: assessment.description,
      priority: assessment.priority,
      score: assessment.score,
      flags: assessment.flags,
      recommendation: assessment.recommendation,
      timestamp: new Date().toISOString(),
      status: 'queued'
    };

    // Add to appropriate priority queue
    if (!this.queue[assessment.priority]) {
      this.queue[assessment.priority] = [];
    }
    
    this.queue[assessment.priority].push(feature);
    
    // Sort by score within priority level
    this.queue[assessment.priority].sort((a, b) => b.score - a.score);
    
    // Add to assessments log
    this.assessments.push(assessment);
    
    this.saveQueue();
    this.saveAssessments();
    
    console.log(`✅ Added "${feature.name}" to ${assessment.priority} queue`);
  }

  removeFeature(featureName, priority = null) {
    let removed = false;
    
    if (priority) {
      // Remove from specific priority level
      if (this.queue[priority]) {
        const index = this.queue[priority].findIndex(f => f.name === featureName);
        if (index !== -1) {
          this.queue[priority].splice(index, 1);
          removed = true;
        }
      }
    } else {
      // Search all priority levels
      Object.keys(this.queue).forEach(p => {
        const index = this.queue[p].findIndex(f => f.name === featureName);
        if (index !== -1) {
          this.queue[p].splice(index, 1);
          removed = true;
        }
      });
    }
    
    if (removed) {
      this.saveQueue();
      console.log(`✅ Removed "${featureName}" from queue`);
    } else {
      console.log(`❌ Feature "${featureName}" not found in queue`);
    }
  }

  markInProgress(featureName) {
    this.updateFeatureStatus(featureName, 'in-progress');
  }

  markCompleted(featureName) {
    this.updateFeatureStatus(featureName, 'completed');
  }

  updateFeatureStatus(featureName, status) {
    let updated = false;
    
    Object.keys(this.queue).forEach(priority => {
      const feature = this.queue[priority].find(f => f.name === featureName);
      if (feature) {
        feature.status = status;
        feature.lastUpdated = new Date().toISOString();
        updated = true;
      }
    });
    
    if (updated) {
      this.saveQueue();
      console.log(`✅ Updated "${featureName}" status to ${status}`);
    } else {
      console.log(`❌ Feature "${featureName}" not found`);
    }
  }

  displayQueue() {
    console.log('\n🎯 FEATURE PRIORITY QUEUE');
    console.log('═'.repeat(80));
    console.log('Target Buyer: Series A Technical Founders ($2M → $10M ARR)\n');

    const priorityOrder = [
      'P0 - Build First',
      'P1 - High Priority', 
      'P2 - Medium Priority',
      'P3 - Low Priority',
      'P4 - Deprioritize'
    ];

    let totalFeatures = 0;

    priorityOrder.forEach(priority => {
      const features = this.queue[priority] || [];
      if (features.length > 0) {
        console.log(`\n📋 ${priority} (${features.length} features):`);
        console.log('─'.repeat(50));
        
        features.forEach((feature, index) => {
          const statusIcon = {
            'queued': '⏳',
            'in-progress': '🔧', 
            'completed': '✅'
          }[feature.status] || '⏳';
          
          console.log(`${index + 1}. ${statusIcon} ${feature.name} (Score: ${feature.score}/100)`);
          console.log(`   Description: ${feature.description}`);
          console.log(`   Flags: ${feature.flags.join(', ')}`);
          console.log(`   Status: ${feature.status}`);
          console.log(`   Added: ${new Date(feature.timestamp).toLocaleDateString()}`);
          console.log('');
        });
        
        totalFeatures += features.length;
      }
    });

    if (totalFeatures === 0) {
      console.log('📭 Queue is empty - run feature assessments to add items\n');
    } else {
      console.log(`📊 Total Features: ${totalFeatures}`);
      this.displayPriorityStats();
    }

    console.log('\n' + '═'.repeat(80));
  }

  displayPriorityStats() {
    const stats = {};
    let total = 0;

    Object.keys(this.queue).forEach(priority => {
      const count = this.queue[priority].length;
      stats[priority] = count;
      total += count;
    });

    if (total > 0) {
      console.log('\n📈 Priority Distribution:');
      Object.entries(stats).forEach(([priority, count]) => {
        if (count > 0) {
          const percentage = Math.round((count / total) * 100);
          console.log(`   ${priority}: ${count} features (${percentage}%)`);
        }
      });

      // Warnings
      if (stats['P4 - Deprioritize'] > stats['P0 - Build First'] + stats['P1 - High Priority']) {
        console.log('\n⚠️  WARNING: More low-value than high-value features in queue');
        console.log('   Consider focusing on buyer value alignment');
      }

      if (stats['P0 - Build First'] === 0 && stats['P1 - High Priority'] === 0) {
        console.log('\n🚨 ALERT: No high-priority features in queue');
        console.log('   All queued features have limited buyer value');
      }
    }
  }

  getNextFeature() {
    const priorityOrder = [
      'P0 - Build First',
      'P1 - High Priority', 
      'P2 - Medium Priority',
      'P3 - Low Priority'
    ];

    for (const priority of priorityOrder) {
      const queuedFeatures = this.queue[priority].filter(f => f.status === 'queued');
      if (queuedFeatures.length > 0) {
        return {
          feature: queuedFeatures[0],
          priority: priority
        };
      }
    }

    return null;
  }

  displayRecommendedNext() {
    const next = this.getNextFeature();
    
    if (next) {
      console.log('\n🎯 RECOMMENDED NEXT FEATURE TO BUILD:');
      console.log('═'.repeat(50));
      console.log(`📋 Feature: ${next.feature.name}`);
      console.log(`📝 Description: ${next.feature.description}`);
      console.log(`⭐ Priority: ${next.priority}`);
      console.log(`📊 Score: ${next.feature.score}/100`);
      console.log(`🏷️  Flags: ${next.feature.flags.join(', ')}`);
      console.log(`💡 Why: ${next.feature.recommendation}`);
    } else {
      console.log('\n📭 No features available for development');
      console.log('   Run buyer value assessments to populate the queue');
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalFeatures: 0,
      priorityBreakdown: {},
      statusBreakdown: { queued: 0, 'in-progress': 0, completed: 0 },
      avgScoreByPriority: {},
      recommendations: []
    };

    // Calculate stats
    Object.keys(this.queue).forEach(priority => {
      const features = this.queue[priority];
      report.totalFeatures += features.length;
      report.priorityBreakdown[priority] = features.length;
      
      if (features.length > 0) {
        const totalScore = features.reduce((sum, f) => sum + f.score, 0);
        report.avgScoreByPriority[priority] = Math.round(totalScore / features.length);
      }

      features.forEach(feature => {
        report.statusBreakdown[feature.status] = (report.statusBreakdown[feature.status] || 0) + 1;
      });
    });

    // Generate recommendations
    if (report.priorityBreakdown['P0 - Build First'] === 0) {
      report.recommendations.push('Consider running assessments to identify P0 features');
    }
    
    if (report.priorityBreakdown['P4 - Deprioritize'] > report.totalFeatures * 0.5) {
      report.recommendations.push('High percentage of low-value features - focus on buyer alignment');
    }

    return report;
  }

  saveQueue() {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(this.queue, null, 2));
  }

  saveAssessments() {
    fs.writeFileSync(ASSESSMENT_LOG, JSON.stringify(this.assessments, null, 2));
  }

  run() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'show':
      case 'display':
        this.displayQueue();
        break;
        
      case 'next':
        this.displayRecommendedNext();
        break;
        
      case 'add':
        if (args.length < 4) {
          console.log('Usage: npm run queue:features add [name] [description] [priority] [score]');
          process.exit(1);
        }
        // This would typically be called by the buyer-value-check script
        break;
        
      case 'remove':
        if (args.length < 2) {
          console.log('Usage: npm run queue:features remove [feature-name]');
          process.exit(1);
        }
        this.removeFeature(args[1]);
        break;
        
      case 'start':
        if (args.length < 2) {
          console.log('Usage: npm run queue:features start [feature-name]');
          process.exit(1);
        }
        this.markInProgress(args[1]);
        break;
        
      case 'complete':
        if (args.length < 2) {
          console.log('Usage: npm run queue:features complete [feature-name]');
          process.exit(1);
        }
        this.markCompleted(args[1]);
        break;
        
      case 'report':
        const report = this.generateReport();
        console.log('\n📊 QUEUE ANALYTICS REPORT');
        console.log('═'.repeat(40));
        console.log(JSON.stringify(report, null, 2));
        break;
        
      default:
        this.displayQueue();
        this.displayRecommendedNext();
    }
  }
}

// Run the queue manager
const queue = new FeaturePriorityQueue();
queue.run();