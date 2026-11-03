<?php

/**
 * Class GeneratorCodePersona
 */
abstract class GeneratorCodePersona
{
    /**
     * Line feed to use in place of EOL
     */
    const LINE_FEED = "\n";
    /**
     *
     */
    const CONTROLLER_NAME = 'Controller';
    /**
     *
     */
    const CONTROLLER_EXTEND = 'GestionarpersonaController';
    /**
     *
     */
    const MODEL_NAME = 'Model';
    /**
     *
     */
    const MODEL_EXTEND = 'ZendExt_Model';
    /**
     *
     */
    const FUNCTIONS_NAME = 'Functions';
    /**
     *
     */
    const INIT_NAME = 'Init';
    /**
     * @var
     */
    protected $nameProject;
    /**
     * @var
     */
    protected $context;
    /**
     * @var ZendExt_File
     */
    protected $fileManager;
    /**
     * @var string _indentation
     */
    protected $indentation = '    ';
    /**
     * @var
     */
    protected $objDocblock;
}