import React from 'react';
import { FaShieldAlt, FaLock, FaUsers, FaCheckCircle, FaServer, FaEye, FaKey } from 'react-icons/fa';

const SecurityFeatures = () => {
  const securityFeatures = [
    {
      title: "Advanced Encryption",
      description: "AES-256 encryption for data at rest and in transit",
      icon: FaLock,
      color: "blue",
      badge: "Enterprise"
    },
    {
      title: "Role-Based Access Control",
      description: "Granular permissions and user management",
      icon: FaUsers,
      color: "purple",
      badge: "Secure"
    },
    {
      title: "24/7 Security Monitoring",
      description: "Round-the-clock threat detection and response",
      icon: FaKey,
      color: "orange",
      badge: "Active"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      green: "bg-green-900/30 text-green-300 border-green-700/50",
      blue: "bg-blue-900/30 text-blue-300 border-blue-700/50",
      purple: "bg-purple-900/30 text-purple-300 border-purple-700/50",
      indigo: "bg-indigo-900/30 text-indigo-300 border-indigo-700/50",
      teal: "bg-teal-900/30 text-teal-300 border-teal-700/50",
      orange: "bg-orange-900/30 text-orange-300 border-orange-700/50"
    };
    return colorMap[color] || colorMap.green;
  };

  return (
    <div className="space-y-6">
      {/* Main Security Section */}
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
          <FaShieldAlt className="text-white text-sm" />
        </div>
        <div>
          <h4 className="text-white font-semibold text-lg">Enterprise Security</h4>
          <p className="text-blue-200 text-sm leading-relaxed mb-3">
            Enterprise-grade security with multiple compliance certifications and advanced protection measures
          </p>
          
          {/* Security Feature Badges */}
          <div className="flex flex-wrap gap-2">
            {securityFeatures.slice(0, 2).map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <span 
                  key={index}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getColorClasses(feature.color)}`}
                >
                  <IconComponent className="w-3 h-3 mr-1" />
                  {feature.title}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="border-t border-blue-700 pt-6">
        <div className="flex items-center justify-center space-x-6 text-sm text-blue-300">
          {securityFeatures.slice(2).map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-400" />
                <span>{feature.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SecurityFeatures; 