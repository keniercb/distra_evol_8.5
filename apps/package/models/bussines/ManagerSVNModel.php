<?php

class ManagerSVNModel extends ZendExt_Model
{


    public function ManagerSVNModel()
    {
        parent::ZendExt_Model();
    }

    public function svnCheckout($url, $dirName, $username, $password)
    {
        if (!$this->svnIsUrl($url)) {
            throw new Zend_Exception('El repositorio esta fuera de servicio.');
        }
        $cmd
            = "svn checkout --ignore-externals $url $dirName".
            " --username=$username --password=$password --no-auth-cache";
        $result = shell_exec($cmd);
        if ($result == null) {
            throw new Zend_Exception(
                'El usuario o la contraseña es incorrecto.'
            );
        }
    }

    public function svnExport($dirfile, $url, $username, $password)
    {
        if (!$this->svnIsUrl($url)) {
            throw new Zend_Exception('El repositorio esta fuera de servicio.');
        }
        $cmd
            = "cd $dirfile; svn export --ignore-externals  ".
            "$url --username=$username --password=$password --no-auth-cache";
        $result = shell_exec($cmd);
        if ($result == null) {
            throw new Zend_Exception(
                'El repositorio no esta configurado correctamente.'
            );
        }
    }

    public function svnAdd($dirfile, $username, $password)
    {
        if (!file_exists($dirfile)) {
            throw new Zend_Exception('No existe el fichero');
        }
        $cmd
            = "svn add $dirfile --username=$username".
            " --password=$password --no-auth-cache";
        $result = shell_exec($cmd);

        if ($result == null) {
            throw new Zend_Exception(
                'El usuario o la contraseña es incorrecto.'
            );
        }

    }

    public function svnList($url, $user, $pass)
    {
        if (!$this->svnIsUrl($url)) {
            throw new Zend_Exception('El repositorio esta fuera de servicio.');
        }
        $cmd
            = "svn list $url --username=$user --password=$pass --no-auth-cache";
        $result = shell_exec($cmd);
        if (!$result) {
            return false;
        }

        $tmp = explode('/', $result);
        $tmp = str_replace(chr(10), '', $tmp);

        return $tmp;

    }

    public function svnIsRepository($url)
    {
        /*
         * si tiene slash o no
         * */
        $slach = ($url[strlen($url) - 1] == '/') ? true : false;
        if (!$slach) {
            $url .= '/';
        }
        $header = $this->svnIsUrl($url);

        if ($header) {
            foreach ($header as $value) {
                /* $post = strpos($value,'Server');
                 $svn = strpos($value,'SVN');*/
                $nofount = strpos($value, '404 Not Found');
                /*   if($post!==false && $svn!==false){
                       return true;
                   }*/
                if ($nofount !== false) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    public function svnIsUrl($url)
    {
        $headers = get_headers($url);

        return is_array($headers) ? $headers : false;
    }

    public function svnClear($dirName)
    {
        $cmd = "cd $dirName; find . -name .svn -print0 | xargs -0 rm -rf";
        shell_exec($cmd);
    }

    public function svnCat($url, $user, $pass)
    {
        if (!$this->svnIsUrl($url)) {
            throw new Zend_Exception('El repositorio esta fuera de servicio.');
        }
        $cmd = "svn cat $url --username=$user --password=$pass --no-auth-cache";
        $result = shell_exec($cmd);

        return $result;
    }

    public function svnExternals($url, $user, $password)
    {
        if (!$this->svnIsUrl($url)) {
            throw new Zend_Exception('El repositorio esta fuera de servicio.');
        }
        $cmd
            = "svn propget svn:externals  $url ".
            "--username=$user --password=$password --no-auth-cache";
        $result = shell_exec($cmd);

        return $result;
    }
}