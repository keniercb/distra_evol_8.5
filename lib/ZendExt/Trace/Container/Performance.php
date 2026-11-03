<?php
class ZendExt_Trace_Container_Performance extends ZendExt_Trace_Container_Action
{
    private $_exec_time;
    private $_memory;

    function __construct(
        $pExecTime, $pMemory, $pFault, $pBegin, $pReference, $pController, $pAction, $pIdTraceCategory, $pUser,
        $pIdCommonStructure, $pFecha = null, $pHora = null
    )
    {
        parent :: __construct(
            $pFault, $pBegin, $pReference, $pController, $pAction, $pIdTraceCategory, $pIdCommonStructure, $pUser,
            $pFecha, $pHora
        );
        parent :: setTraceType(7);
        $this->_exec_time = $pExecTime;
        $this->_memory = $pMemory;
    }

    function getExecTime()
    {
        return $this->_exec_time;
    }

    function getMemory()
    {
        return $this->_memory;
    }
}
