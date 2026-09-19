import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ArrowRight, 
  RefreshCw,
  Sparkles,
  FileText
} from 'lucide-react';
import { api, Student } from '../lib/api';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onImportSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Partial<Student>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const headers = [
      'student_id',
      'name',
      'course',
      'semester',
      'attendance',
      'previous_gpa',
      'current_gpa',
      'assignment_rate',
      'internal_marks',
      'backlogs',
      'engagement'
    ];

    const sampleRows = [
      ['STU2001', 'Meera Kapoor', 'B.Tech Computer Science', '4', '82', '7.8', '8.1', '85', '79', '0', '80'],
      ['STU2002', 'Rohan Verma', 'B.Tech Information Technology', '3', '59', '6.5', '5.8', '50', '62', '2', '52'],
      ['STU2003', 'Ananya Deshmukh', 'MCA', '2', '76', '7.1', '7.4', '80', '72', '0', '75'],
      ['STU2004', 'Vikramaditya Roy', 'B.Tech Electronics & Comm', '5', '48', '6.2', '5.1', '40', '58', '3', '45']
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...sampleRows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'DropoutGuard_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      parseCSV(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      parseCSV(droppedFile);
    } else {
      setError('Please upload a valid CSV (.csv) file.');
    }
  };

  const parseCSV = (csvFile: File) => {
    setError(null);
    setSuccessCount(null);
    setFile(csvFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.trim().split('\n');
        if (lines.length <= 1) {
          setError('CSV file appears to be empty or missing data rows.');
          return;
        }

        const rawHeaders = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
        const students: Partial<Student>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Split by comma ignoring commas inside quotes
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^["']|["']$/g, ''));
          
          const obj: any = {};
          rawHeaders.forEach((h, idx) => {
            obj[h] = values[idx];
          });

          students.push({
            studentId: obj.student_id || obj.studentid || obj.id || `STU_IMP_${i}`,
            name: obj.name || `Student ${i}`,
            course: obj.course || 'B.Tech Computer Science',
            semester: parseInt(obj.semester) || 1,
            attendance: parseFloat(obj.attendance) || 75,
            previousGpa: parseFloat(obj.previous_gpa || obj.previousgpa) || 7.0,
            currentGpa: parseFloat(obj.current_gpa || obj.currentgpa) || 7.0,
            assignmentRate: parseFloat(obj.assignment_rate || obj.assignmentrate) || 80,
            internalMarks: parseFloat(obj.internal_marks || obj.internalmarks) || 75,
            backlogs: parseInt(obj.backlogs) || 0,
            engagement: parseFloat(obj.engagement) || 75
          });
        }

        if (students.length === 0) {
          setError('Could not extract valid student rows from CSV.');
        } else {
          setParsedData(students);
        }
      } catch (err: any) {
        setError('Failed to parse CSV file: ' + err.message);
      }
    };
    reader.readAsText(csvFile);
  };

  const handleIngest = async () => {
    if (parsedData.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.bulkImportStudents(parsedData);
      setSuccessCount(res.count);
      onImportSuccess(res.count);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error executing bulk student ingestion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bento-box bg-[#070b14]/95 p-6 sm:p-8 space-y-6 z-10 border border-white/[0.12] shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-neon-cyan/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">Batch Student Ingestion (CSV)</h3>
              <p className="text-xs text-slate-400 font-mono">Upload university cohort records for automated ML risk scoring</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors border border-white/[0.08] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Template Download Bar */}
        <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-200 block">Institutional CSV Template</span>
            <span className="text-[10px] text-slate-400 font-mono">Standardized headers for academic telemetry ingestion</span>
          </div>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="btn-secondary group text-xs px-3 py-1.5 flex items-center gap-1.5 hover:border-cyan-500/50 hover:text-cyan-300"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Download Sample CSV</span>
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/[0.12] hover:border-cyan-500/60 rounded-2xl p-8 text-center bg-black/30 hover:bg-[#0c1222]/40 transition-all cursor-pointer space-y-3 group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv" 
            className="hidden" 
          />
          <div className="w-12 h-12 rounded-2xl bg-[#0b101e] text-slate-400 group-hover:text-cyan-400 flex items-center justify-center mx-auto border border-white/[0.08] group-hover:scale-110 transition-all shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              {file ? file.name : 'Click to select CSV file or drag & drop here'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports .csv files with student identifiers, grades, and attendance metrics
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successCount !== null && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-neon-emerald/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Successfully ingested and calculated risk scores for <strong>{successCount}</strong> students!</span>
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedData.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Parsed {parsedData.length} records (Previewing first 4)
              </span>
              <span className="text-emerald-400 font-bold">Ready for Ingestion</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-black/40">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0b101e] text-slate-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3">Current GPA</th>
                    <th className="py-2.5 px-3">Backlogs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {parsedData.slice(0, 4).map((s, idx) => (
                    <tr key={idx} className="text-slate-300">
                      <td className="py-2.5 px-3 text-indigo-400 font-bold">{s.studentId}</td>
                      <td className="py-2.5 px-3 font-medium text-white">{s.name}</td>
                      <td className="py-2.5 px-3 truncate max-w-[140px]">{s.course}</td>
                      <td className="py-2.5 px-3">{s.attendance}%</td>
                      <td className="py-2.5 px-3">{s.currentGpa}</td>
                      <td className="py-2.5 px-3">{s.backlogs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleIngest}
            disabled={loading || parsedData.length === 0}
            className="btn-primary btn-shimmer group text-xs px-5 py-2.5 disabled:opacity-40 flex items-center gap-1.5 shadow-neon-indigo/30"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Batch Risk Calibration...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Ingest {parsedData.length} Records</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
