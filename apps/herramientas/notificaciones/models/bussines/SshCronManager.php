<?php

class SshCronManager extends ZendExt_Model
{
    private $connection;
    private $path;
    private $handle;
    private $cron_file;

    public function SshCronManager()
    {
        $path_length     = strrpos(__FILE__, "/");
        $this->path      = substr(__FILE__, 0, $path_length) . '/';
        $this->handle    = 'crontab.txt';
        $this->cron_file = "{$this->path}{$this->handle}";

        $rsa = new ZendExt_RSA_Facade();

        $register = Zend_Registry::getInstance();
        $array = array('skipExtends' => true, 'allowModifications' => true);
        $config = new Zend_Config_Ini(
            $register->config->security_config, null, $array
        );

        $username = $rsa->decrypt($config->crontab->user);
        $password = $rsa->decrypt($config->crontab->password);
        $host = "127.0.0.1";
        $port = "22";

        try
        {
            if (is_null($host) || is_null($port) || is_null($username) || is_null($password))
                throw new Exception("Por favor revise el fichero de configuración de conexión.");

            $this->connection = @ssh2_connect($host, $port);
            if ( ! $this->connection)
                throw new Exception("La conexión SSH2 no se pudo establacer.");

            $authentication = @ssh2_auth_password($this->connection, $username, $password);
            if ( ! $authentication)
                throw new Exception("La conexión no se pudo establacer para este usuario y contraseña.");
        }
        catch (Exception $e)
        {
            $this->error_message('HERRNOT010', $e->getMessage());

        }
        parent::ZendExt_Model();
    }

    public function exec()
    {
        $argument_count = func_num_args();
        try
        {
            if ( ! $argument_count) throw new Exception("No existe nada para ejecutar, no hay argumentos específicados.");

            $arguments = func_get_args();

            $command_string = ($argument_count > 1) ? implode(" && ", $arguments) : $arguments[0];

            $stream = @ssh2_exec($this->connection, $command_string);
            if ( ! $stream) throw new Exception("No es posible ejecutar el siguiente comando : {$command_string}");

        }
        catch (Exception $e)
        {
            $this->error_message('HERRNOT011',$e->getMessage());
        }
        return $this;
    }

    public function write_to_file($path=NULL, $handle=NULL)
    {
        if ( ! $this->crontab_file_exists())
        {
            $this->handle = (is_null($handle)) ? $this->handle : $handle;
            $this->path   = (is_null($path))   ? $this->path   : $path;

            $this->cron_file = "{$this->path}{$this->handle}";

            $init_cron = "crontab -l > {$this->cron_file} && [ -f {$this->cron_file} ] || > {$this->cron_file}";

            $this->exec($init_cron);
        }

        return $this;
    }

    public function remove_file()
    {
        if ($this->crontab_file_exists()) $this->exec("rm {$this->cron_file}");

        return $this;
    }

    public function append_cronjob($cron_jobs=NULL)
    {
        if (is_null($cron_jobs)) $this->error_message('HERRNOT011', "Ningún trabajo para añadir!! Por favor, especifique una tarea programada.");

        $append_cronfile = "echo '";

        $append_cronfile .= (is_array($cron_jobs)) ? implode("\n", $cron_jobs) : $cron_jobs;

        $append_cronfile .= "'  >> {$this->cron_file}";

        $install_cron = "crontab {$this->cron_file}";

        $this->write_to_file()->exec($append_cronfile, $install_cron)->remove_file();

        return $this;
    }

    public function remove_cronjob($cron_jobs=NULL)
    {
        if (is_null($cron_jobs)) $this->error_message('HERRNOT011', "Ningún trabajo para eliminar!! Por favor, especifique una tarea programada.");

        $this->write_to_file();

        $cron_array = file($this->cron_file, FILE_IGNORE_NEW_LINES);

        if (empty($cron_array)) $this->error_message('HERRNOT011', "Ningún trabajo para eliminar!!  El fichero del crontab está vacío.");

        $original_count = count($cron_array);

        /*if (is_array($cron_jobs))
        {
            foreach ($cron_jobs as $cron_regex)
                $cron_array = preg_grep($cron_regex, $cron_array, PREG_GREP_INVERT);
        }
        else
        {
            $cron_array = preg_grep($cron_jobs, $cron_array, PREG_GREP_INVERT);
        }*/

        foreach ($cron_array as $clave => $jobs){
        $pos = strpos($jobs, $cron_jobs);
        if ($pos !== false) {
            unset($cron_array[$clave]);
            break;
        }
    }

    //print_r($this->cron_file);
    if(count($cron_array) === 0)
        return $this->remove_file();
     elseif($original_count !== count($cron_array)){
        return $this->remove_crontab()->append_cronjob($cron_array);
     }

    }

    public function remove_crontab()
    {
        $this->exec("crontab -r")->remove_file();

        return $this;
    }

    public function clear_crontab_file(){
        $this->write_to_file();
        $cron_array = file($this->cron_file, FILE_IGNORE_NEW_LINES);

        $fecha_actual = new DateTime();
        $dia = $fecha_actual->format('d');
        foreach ($cron_array as $clave => $cron){
            $fecha = explode('ID=', $cron);

            if($fecha[0]){
                $espaces = explode(' ',$fecha[0]);

                if($espaces[2] < 20){
                    $id = explode(' sh',$fecha[1]);
                    $this->remove_cronjob($id[0]);
                }
            }
        }

    }


    private function crontab_file_exists()
    {
        return file_exists($this->cron_file);
    }

    private function error_message($nameexcep, $error)
    {
        throw new ZendExt_Exception($nameexcep, null, array($error));
    }

}