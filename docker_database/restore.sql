IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'FNLParm')
BEGIN
    RESTORE DATABASE FNLParm
    FROM
      DISK = N'/var/opt/mssql/backup/FNLParm.bak'
    WITH MOVE 'FNLParmRU' TO '/var/opt/mssql/data/FNLParm.mdf',
         MOVE 'FNLParmRU_log' TO '/var/opt/mssql/data/FNLParm_log.ldf';
END
