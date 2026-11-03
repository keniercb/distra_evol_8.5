<?php
/**
 * @class         AxchartModel
 * Extension
 *
 * @package       Utiles
 * @subpackage    Plugin
 * @author        Division GE
 * @copyright (c) 2016, XETID
 * @version       1.0
 */
use EDI\Encoder;

class EdiModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::__construct();
        set_time_limit(0);
        ini_set('max_execution_time', 0);
    }

    public function export($params)
    {
        $params = json_decode($params, 1);
        $conn = Zend_Registry::get('conexion');
        $data = $conn->execute($params['params']['sqlQuery'])->fetchAll(PDO::FETCH_ASSOC);
        $arr = [["UNB",["UNOA","2"],"TCM","MELFI",["171203","1544"],"01736414"],["UNH","01736414",["IFCSUM","D","05B","UN","14"]],["BGM","270","000001","9"],["TDT","20","1721","1","13",["NIRINT","172","20"],"","",["","103","","AUGUSTA UNITY","CY"]],["LOC","9",["CUMAR","139","6"],["TCM","TER","ZZZ"]],["DTM",["132","201712030800","203"]],["NAD","CA",["NIRINT","172","20"]],["EQD","CN","GLDU7149764",["45G1","102","5"],"","6","5"],["RFF",["BN","COVER274"]],["DTM",["203","201712031530","203"]],["LOC","11",["CUMOA","139","6"]],["LOC","9",["CUMAR","139","6"]],["LOC","7",["CUMOA","139","6"]],["LOC","147",["0140384","","5"]],["MEA","AAE","G",["KGM","24728"]],["MEA","AAE","T",["KGM","3900"]],["SEL","383643","CA"],["NAD","CF",["MLF","172","20"]],["EQD","CN","NIRU8981454",["42P3","102","5"],"","6","5"],["RFF",["BN","COVER274"]],["DTM",["203","201712031542","203"]],["LOC","11",["CUMOA","139","6"]],["LOC","9",["CUMAR","139","6"]],["LOC","7",["CUMOA","139","6"]],["LOC","147",["0140584","","5"]],["MEA","AAE","G",["KGM","21270"]],["MEA","AAE","T",["KGM","4925"]],["DIM","9",["CMT","0","0","122"]],["NAD","CF",["MLF","172","20"]],["CNT",["16","2"]],["UNT","30","01736414"],["UNZ","1","01736414"]]; //array
        $p = new Encoder($arr, false); //one segment per line
        $report = $p->get();
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Description: File Transfer');
        header('Content-Disposition: attachment; filename='.ucfirst($params['name']) . ".edi");
        header('Content-Transfer-Encoding: binary');
        header('Content-Length: ' . strlen($report));
        header ('Content-Type: ' . $params['content'] .'; charset=utf-8');
        echo $report;
    }
}