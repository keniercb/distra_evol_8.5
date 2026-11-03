<?php

/**
 * AMQP Abstract Worker
 * Definición abstracta de un worker de tareas.
 *
 * @package    AMQP
 * @subpackage Worker
 * @author     Equipo de Arquitectura UCID
 * @version    1.0
 */
abstract class Amqp_Worker_Abstract extends ZendExt_Model {

    protected $registerTask;
    private $idProcess;
    private $task_name;
    protected $taskRunner;

    public function __construct($idProcess = null, $task_name) {
        parent :: __construct();
        $this->idProcess = $idProcess;
        $this->task_name = $task_name;
        $this->taskRunner = new Amqp_Task_Mgr();
    }

    public abstract function work($args);

    private final function finish() {
        $this->taskRunner->runTask($this->task_name, array(), array(), $this->idProcess);
    }

    public final function _work($args) {
        echo "begin working at " . Zend_Date :: now() . "... \n";
        $this->work($args);
        echo "work finished at " . Zend_Date :: now() . "... \n";
        $this->finish();
    }

}